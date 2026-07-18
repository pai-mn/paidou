# 派兜 Paidou

A Genshin Impact Chinese Hanzi variation of [Wordle](https://www.powerlanguage.co.uk/wordle/) - 派兜.

[paidou.pai.mn](https://paidou.pai.mn)

## Development Setup

- Install [Bun](https://bun.sh/) >=1.3.13 (or Node.js >=22.12.0 when running the toolchain with Node.js)
- Run `bun install`
- Run `bun run dev` and visit `http://localhost:4444`

## 成语勘误

成语数据库储存于

- [./src/shared/data/idioms.txt](./src/shared/data/idioms.txt) - 已知的成语列表
- [./src/shared/data/polyphones.json](./src/shared/data/polyphones.json) - 特殊发音的成语列表

二者互不包含。

如遇到成语缺失或发音错误，请编辑 [./src/shared/data/new.txt](./src/shared/data/new.txt) 文件，一行一词，完成后执行 `bun run update` 命令，脚本会自动抓取 [汉典](https://www.zdic.net/) 的数据更新成语数据库。如遇汉典中也缺失的成语，其会留存在 new.txt 中，需要手动判断与添加。

## Tech Stack

- [Vue 3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [VueUse](https://vueuse.org/)
- [UnoCSS](https://unocss.dev/)

## License

[MIT](./LICENSE) License
