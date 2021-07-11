# 迁移指南

## 迁移至 2.x

参见 [Mirai http api 2.x 迁移文档](https://github.com/project-mirai/mirai-api-http/blob/master/docs/misc/Migration2.md)，修改 `setting.yml` 文件。

- `MiraiApiHttpConfig` 类型移除，添加 `MiraiApiHttpSetting` 类型（与 `setting.yml` 中的配置一致）
- `authKey` 重命名为 `verifyKey`
- `auth` 函数重命名为 `verify`
- `verify` 函数重命名为 `bind`
- `adapters` 字段中含有 `ws` 时，自动启用 Websocket
