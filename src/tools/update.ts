import fs from 'fs'
import c from 'ansis'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { toZhuyin } from '#/shared/tools/zhuyin/convert.ts'
import { pinyin } from 'pinyin-pro'
import { normalizePinyin } from '#/tools/utils.ts'
import { getWordInfoFromZDict } from '#/tools/zdict.ts'

interface WordRow {
  word: string
}

interface PolyphoneRow extends WordRow {
  pinyin: string
}

function readCsv<T>(path: string): T[] {
  if (!fs.existsSync(path)) return []
  return parse(fs.readFileSync(path, 'utf8'), { bom: true, columns: true, skip_empty_lines: true, trim: true }) as T[]
}

const polyphones = Object.fromEntries(
  readCsv<PolyphoneRow>('src/server/data/polyphones.csv').map(({ word, pinyin }) => [word, pinyin]),
)
const idioms = new Set(readCsv<WordRow>('src/server/data/idioms.csv').map(({ word }) => word))
const newOnes = new Set(readCsv<WordRow>('src/server/data/pending-idioms.csv').map(({ word }) => word))
const unknown = new Set(readCsv<WordRow>('src/server/data/unknown-idioms.csv').map(({ word }) => word))

async function getPinyinWeb(word: string) {
  return pinyin(word, { toneType: 'num', type: 'array' }).join(' ')
}

function validPinyin(word: string, pinyin: string) {
  if (!pinyin.match(/^[a-z0-9 ]+$/)) return console.log(c.red(`[${word}] invalid char`), c.yellow(pinyin))
  if (!pinyin.match(/[0-9]/)) return console.log(c.red(`[${word}] invalid tone`), c.magenta(pinyin))
  const parts = pinyin.split(/\s+/g)
  if (parts.length !== 4) return console.log(c.red(`[${word}] invalid length`), c.blue(pinyin))
  parts.forEach(async (i, idx) => {
    const match = i.match(/^([a-z]+)([0-4])?$/)
    if (!match)
      return console.error(
        c.red(`[${word}] invalid pinyin [${idx}]:`),
        c.blue(i),
        '->',
        c.green(await getPinyinWeb(word[idx])),
      )
    const [, body] = match
    if (!toZhuyin(body))
      console.error(
        c.red(`[${word}] invalid pinyin [${idx}]:`),
        c.blue(i),
        '->',
        c.green(await getPinyinWeb(word[idx])),
      )
    //   if (!tone)
    //     console.error(c.red(`[${word}] no tone [${idx}]:`), c.blue(i), '->', c.green(await getPinyinWeb(word[idx])))
  })
}

async function run() {
  const polyphonesKeys = Object.keys(polyphones)

  console.log(newOnes.size, 'new items')
  console.log(polyphonesKeys.length, 'polyphones')
  console.log(idioms.size, 'idioms')

  for (const word of Object.keys(polyphones)) {
    if (!polyphones[word]) polyphones[word] = await getPinyinZDict(word)
    const pinyingComputed = await getPinyinWeb(word)
    if (!polyphones[word] || pinyingComputed === polyphones[word]) {
      console.log(`\n[${word}] removed from polyphones`)
      delete polyphones[word]
      idioms.add(word)
    } else {
      validPinyin(word, polyphones[word])
      idioms.delete(word)
    }
  }

  const items = Array.from(newOnes)
  const len = items.length
  for (let idx = 0; idx < len; idx++) {
    const word = items[idx]

    if (!unknown.has(word)) {
      delete polyphones[word]
      const pinyinZDict = await getPinyinZDict(word)

      newOnes.delete(word)

      if (pinyinZDict) {
        const pinyingComputed = await getPinyinWeb(word)
        if (!pinyinZDict || pinyingComputed === pinyinZDict) {
          delete polyphones[word]
          idioms.add(word)
        } else {
          console.log(`[${word}] Polyphones! ${pinyingComputed} -> ${pinyinZDict}`)
          polyphones[word] = pinyinZDict
        }
      } else {
        unknown.add(word)
      }
    }

    if (idx && idx % 10 === 0) {
      save()
      console.log(`${idx + 1} / ${len} ${(((idx + 1) / len) * 100).toFixed(1)}%`)
    }
  }

  save()

  if (unknown.size) console.log(unknown.size, 'missed items, please check manually')
}

function save() {
  console.log('\n---SAVING---')
  fs.writeFileSync(
    'src/server/data/polyphones.csv',
    stringify(
      Object.entries(polyphones)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([word, pinyin]) => ({ word, pinyin })),
      { columns: ['word', 'pinyin'], header: true },
    ),
  )
  fs.writeFileSync(
    'src/server/data/idioms.csv',
    stringify(
      Array.from(idioms)
        .sort()
        .map((word) => ({ word })),
      { columns: ['word'], header: true },
    ),
  )
  fs.writeFileSync(
    'src/server/data/pending-idioms.csv',
    stringify(
      Array.from(newOnes).map((word) => ({ word })),
      { columns: ['word'], header: true },
    ),
  )
  fs.writeFileSync(
    'src/server/data/unknown-idioms.csv',
    stringify(
      Array.from(unknown).map((word) => ({ word })),
      { columns: ['word'], header: true },
    ),
  )
}

run()

async function getPinyinZDict(i: string) {
  console.log(`\n[${i}] fetching`)
  const data = await getWordInfoFromZDict(i)
  const pinyinZDict = normalizePinyin(data?.pinyin || '')
  if (pinyinZDict) console.log(`[${i}] got ${pinyinZDict}`)
  else console.log(`[${i}] missed`)

  return pinyinZDict
}
