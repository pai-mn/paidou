# 派兜 Paidou

A Genshin Impact Chinese Hanzi variation of [Wordle](https://www.powerlanguage.co.uk/wordle/) - 派兜.

[paidou.pai.mn](https://paidou.pai.mn)

请勿剧透！PLEASE DO NOT SPOIL

> **Note**
> 派兜的答案库至 2023 年 2 月 28 日为止将**不再更新**；后序的题目将从过往一年的题目中随机抽取。仓库以 MIT 协议开放，欢迎 Fork 与修改。感谢大家对派兜的支持与喜爱。

## Development Setup

- Install [Bun](https://bun.sh/) >=1.3.13 (or Node.js >=22.12.0 when running the toolchain with Node.js)
- Run `bun install`
- Run `bun run dev` and visit `http://localhost:4444`

## 成语勘误

成语数据库储存于

- [./src/data/idioms.txt](./src/data/idioms.txt) - 已知的成语列表
- [./src/data/polyphones.json](./src/data/polyphones.json) - 特殊发音的成语列表

二者互不包含。

如遇到成语缺失或发音错误，请编辑 [./src/data/new.txt](./src/data/new.txt) 文件，一行一词，完成后执行 `bun run update` 命令，脚本会自动抓取 [汉典](https://www.zdic.net/) 的数据更新成语数据库。如遇汉典中也缺失的成语，其会留存在 new.txt 中，需要手动判断与添加。

## Tech Stack

- [Vue 3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [VueUse](https://vueuse.org/)
- [UnoCSS](https://unocss.dev/)

## License

[MIT](./LICENSE) License
