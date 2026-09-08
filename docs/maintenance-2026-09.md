# 2026-09-08 维护记录

## 基线

- 遗留文件：`/run/media/thou/d19edbfd-eba9-4b70-a884-dc2529b19c09/home/thou/blog`，只读取，未改动。
- GitHub `main`：`e9dec67cbd797252808c4676c4f1917cb3123143`；与遗留 `.deploy_git` 一致。
- 线上：`https://blog.txgde.space`，返回 HTTP 200，Vercel 托管。
- 全部 26 篇文章、81 个标签、6 个分类已恢复。原文保留，仅将日期等值规范化为 UTC+8 本地时间、原图床链接改成 HTTPS，以及给最新两篇文章增加 description。

## 修复

| 问题 | 原因与处理 |
| --- | --- |
| 首页数字摘要 | Redefine 的 `strip_html(post.content)` 将代码行号拼接进摘要。新增独立 Hexo 过滤器，提取文字前移除代码块，保留正文的代码和行号。 |
| 搜索及字数功能不完整 | 配置已开启，但缺少插件；补齐 `hexo-generator-searchdb`、`hexo-wordcount` 并生成完整搜索索引。 |
| 主题升级无效风险 | 同时存在 `themes/redefine` 和 npm 主题；改为仅使用 npm 版本，锁定全部直接依赖并提交 npm lockfile。 |
| 日期路径随环境变化 | 原始 RFC 日期字符串和 Hexo 的本地 Moment 时区共同影响路径。日期规范化，同时用 `tools/hexo.cjs` 固定进程时区，保留旧 URL。 |
| 规范链接错误 | Redefine `autoCanonical` 强制小写，会把大小写敏感路径指向不存在的页面；用项目 helper 保留大小写并正确编码。 |
| 示例社交账号残留 | Hexo 按索引合并数组，会保留主题的 `you@example.com`。生成前用站点自己的有序数组覆盖主题列表。 |
| 手机标题截断 | 长英文名称超过 flex 子项的最小宽度；用 `source/css/custom.css` 允许长标题换行。 |
| 导航缺失 | 原 `navbar.tags/categories` 不是有效导航位置；迁入 `navbar.links`，补齐归档、标签和分类。 |
| 公安备案不显示 | 原 `footer.gwab` 不被主题支持，链接还有错误反斜杠；改为有效页脚链接，同时修复赞助链接闭合标签。 |
| 评论失效 | 原 Twikoo 地址现为 2FAuth，暂时关闭评论入口，保留地址供恢复。 |

## 验证

- Node 24.20.0 下完成安装、测试和静态构建。
- 摘要回归测试：长代码开头、段落边界、手动摘要、隐藏摘要、描述优先、纯代码兜底、HTML 转义、中文和 emoji 截断。
- 构建产物检查：26 条旧文章 URL、26 个首页/分页卡片、26 条搜索记录、135 个 HTML 页面的站内链接和资源。
- 在外部 `TZ=UTC` 和 `TZ=America/Los_Angeles` 的构建环境中核对旧链接，由 npm 启动脚本统一到 UTC+8。
- 浏览器验证桌面及手机排版、搜索 `broadcastMAC`、搜索结果跳转、正文代码高亮与行号。
- npm 安装时审计报告为 0 个已知漏洞。部分上游传递依赖仍有弃用提示，不使用未经验证的强制覆盖。
- 本地网络受限时，主题自己的在线版本检查会提示失败；该提示不影响构建，不依赖该接口加载本站主题资源。

维护后的源码通过独立的 `source` 分支管理，保留 `main` 中的原网页历史。本次未修改 Vercel 项目或执行生产分支切换。预览切换与回滚步骤见根目录 README。

## 上游参考

- [Hexo Node 要求](https://hexo.io/docs/)
- [Hexo 发行版本](https://github.com/hexojs/hexo/releases)
- [Redefine 2.9.0 发行说明](https://github.com/EvanNotFound/hexo-theme-redefine/releases/tag/v2.9.0)
- [Vercel 支持的 Node 版本](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel 项目配置](https://vercel.com/docs/project-configuration)
- [GitHub Actions checkout](https://github.com/actions/checkout/releases)、[setup-node](https://github.com/actions/setup-node/releases)、[upload-artifact](https://github.com/actions/upload-artifact/releases)
