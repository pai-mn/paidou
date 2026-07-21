# 派兜 Paidou

原神主题的中文汉字版 [Wordle](https://www.powerlanguage.co.uk/wordle/)。

[paidou.pai.mn](https://paidou.pai.mn)

## 本地开发

- 安装 [Bun](https://bun.sh/) >= 1.3.13（使用 Node.js 运行工具链时需 >= 22.12.0）
- 运行 `bun install`
- 运行 `bun run dev`，访问 `http://localhost:4444`

API 服务默认使用 8787 端口。生产环境依次运行 `bun run build` 和 `bun start`，也可直接运行 `./paidou.sh`。使用 `bun run test` 运行测试。

## 游戏玩法

每天猜一个四字词语，最多尝试 10 次。支持拼音、注音和双拼输入，以及简繁体中文。

## 题目与发音

游戏数据储存于

- [./src/server/data/answers.csv](./src/server/data/answers.csv) - 每日题目候选列表
- [./src/server/data/polyphones.csv](./src/server/data/polyphones.csv) - 需要覆盖默认拼音的特殊发音列表

题目必须由四个汉字组成，每日题目按北京时间轮换。未收录在 `polyphones.csv` 中的词语会使用拼音库的默认读音。

## 技术栈

- [Vue 3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [VueUse](https://vueuse.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Hono](https://hono.dev/)（API 与生产服务器）
- [Vitest](https://vitest.dev/)（测试）

## 许可证

[MIT](./LICENSE)
