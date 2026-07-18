# 派兜 Paidou

A Genshin Impact Chinese Hanzi variation of [Wordle](https://www.powerlanguage.co.uk/wordle/) - 派兜.

[paidou.pai.mn](https://paidou.pai.mn)

## Development Setup

- Install [Bun](https://bun.sh/) >=1.3.13 (or Node.js >=22.12.0 when running the toolchain with Node.js)
- Run `bun install`
- Run `bun run dev` and visit `http://localhost:4444`

## 成语勘误

成语数据储存于

- [./src/server/data/answers.csv](./src/server/data/answers.csv) - 每日题目候选列表
- [./src/server/data/idioms.csv](./src/server/data/idioms.csv) - 已知的成语列表
- [./src/server/data/polyphones.csv](./src/server/data/polyphones.csv) - 特殊发音的成语列表

词典与特殊发音表互不包含。

如遇到成语缺失或发音错误，请编辑 [./src/server/data/pending-idioms.csv](./src/server/data/pending-idioms.csv)，完成后执行 `bun run update`。脚本会自动抓取 [汉典](https://www.zdic.net/) 的数据更新成语数据库；汉典中缺失的条目会保留在 `unknown-idioms.csv`，供人工处理。

## Tech Stack

- [Vue 3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [VueUse](https://vueuse.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

[MIT](./LICENSE) License
