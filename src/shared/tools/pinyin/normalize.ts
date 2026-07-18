export function normalizePinyinSyllable(pinyin: string) {
  return pinyin.replace(/ü/g, 'v').replace(/^(y|j|q|x)u([a-z]*[0-9]?)$/g, '$1v$2')
}
