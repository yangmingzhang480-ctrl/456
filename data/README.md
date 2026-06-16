# 玄灵界本地数据库

此目录由后端 `server/routes/game.ts` 作为本地 JSON 数据库使用。

- `world-state.json`：当前世界变量、轮回序列、黑海侵蚀率。
- `chats/*.json`：每条酒馆推演会话。
- `lorebooks/*.json`：世界书。
- `presets/*.json`：推演预设。

API Key 不应提交到仓库。请通过后端本地 `data/settings.json` 或运行环境变量配置。