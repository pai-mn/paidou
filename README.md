# 派兜 Paidou

A Genshin Impact Chinese Hanzi variation of [Wordle](https://www.powerlanguage.co.uk/wordle/) - 派兜.

[paidou.pai.mn](https://paidou.pai.mn)

## Development Setup

- Install [Bun](https://bun.sh/) >=1.3.13 (or Node.js >=22.12.0 when running the toolchain with Node.js)
- Run `bun install`
- Run `bun run dev` and visit `http://localhost:4444`

## 题目与发音

游戏数据储存于

- [./src/server/data/answers.csv](./src/server/data/answers.csv) - 每日题目候选列表
- [./src/server/data/polyphones.csv](./src/server/data/polyphones.csv) - 需要覆盖默认拼音的特殊发音列表

题目必须由四个汉字组成。未收录在 `polyphones.csv` 中的词语会使用拼音库的默认读音。

## Tech Stack

- [Vue 3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [VueUse](https://vueuse.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

[MIT](./LICENSE) License
