# Thou の空间

Hexo 博客源码，站点地址：<https://blog.txgde.space>。

本次维护从遗留目录恢复了全部 26 篇文章，使用 Hexo **8.1.2**、Redefine **2.9.0**、Node **24 LTS**。主题只通过 npm 安装，个性化配置放在 `_config.redefine.yml`，不修改 `node_modules`。

## 本地写作

本机已有 fnm，可在项目目录执行：

```sh
fnm install
fnm use
npm ci
npm run server
```

使用 nvm 时，对应执行 `nvm install`、`nvm use`。两者都会读取 `.nvmrc`。开发服务器默认是 <http://localhost:4000>。

```sh
npm run new -- "文章标题"
npm run check
```

文章位于 `source/_posts/`。建议在 front matter 填写 `description`，作为简短简介；留空时自动提取正文文字，排除代码块、行号和脚本。`excerpt` 和 `<!-- more -->` 手写摘要仍然优先，`excerpt: false` 可隐藏预览。代码为主、没有文字的文章会以标题作为兜底。

日期使用北京时间，例如 `date: '2026-09-08 14:00:00'`。通过 npm 脚本执行 Hexo：脚本会固定进程时区为 `Asia/Shanghai`，避免 Vercel 的 UTC 环境改变日期路径。不要随意改旧文章的文件名或日期，它们组成永久链接。

## 检查与升级

`npm run check` 执行摘要回归测试、干净构建和产物检查，包括 26 条旧文章链接、分页、搜索索引、代码块、规范链接和全部生成页面的站内链接及资源。`public/` 和 `db.json` 是生成文件，不提交。

GitHub Actions 在推送和 PR 时执行同样的检查；Dependabot 按月提出 npm 与 Actions 升级。要让 Dependabot 生效，源码分支需要设为 GitHub 默认分支，或将其配置同步到默认分支。

```sh
npm outdated
npm install --save-exact hexo@latest hexo-theme-redefine@latest
npm audit
npm run check
```

升级 Hexo 后同步 `package.json` 中的 `hexo.version`。升级主题时查看其发行说明及 `node_modules/hexo-theme-redefine/_config.yml`。Node 升级同时更新 `.nvmrc`、`package.json` 的 `engines.node`，再用新版本执行 `npm ci` 和 `npm run check`。使用 Vercel 已支持的 LTS；本次实际验证版本为 **24.20.0**，机器原有的 Node 26 保留。

## Vercel 部署

远端仓库是 <https://github.com/txgde-space/txgde_space_blog>。截至本次维护，`main` 存放生成的 HTML，最新提交为 `e9dec67cbd797252808c4676c4f1917cb3123143`，并非 Hexo 源码。维护后的源码使用独立的 `source` 分支，保留原 `main` 历史；推送源码不会自动完成生产站点的分支切换。

推荐把 `source` 作为长期维护分支，让 Vercel 构建源码：

1. 提交当前源码，推送 `source` 分支。保留原 `main`，不需要强制推送。
2. 在现有 Vercel 项目对 `source` 创建 Preview，Root Directory 设置为仓库根目录。
3. 确认配置使用 `vercel.json`：Framework 为 Hexo、Node 为 24.x、Install 为 `npm ci`、Build 为 `npm run check`、Output 为 `public`。清除旧项目里与这些设置冲突的覆盖值。
4. 验证 Preview 的首页摘要、搜索、文章、归档、移动端和 404 后，将现有项目的 Production Branch 改为 `source`，再触发部署。现有自定义域名继续使用原项目。
5. 将 GitHub 默认分支改为 `source`，使源码成为默认入口并启用其 Dependabot 配置。

如需回滚，在 Vercel 将迁移前的生产部署恢复为 Production，并将 Production Branch 改回 `main`。旧分支和遗留目录都保留着原站点，不需要重新构建旧依赖。

旧版 `hexo deploy` 会将生成文件直接发布到远端 `main`；本次已移除该部署插件和配置，后续由 Vercel 直接构建源码。GitHub Actions 只校验并保存产物，不向生产分支写入网页。

## 评论与资源

旧 Twikoo 地址 `https://home.txgde.space:30443` 在 2026-09-08 返回的是 **2FAuth** 页面。评论暂时禁用，原地址仍保存在主题配置中。恢复时先确认真实 Twikoo 服务地址和博客域名配置，再更新 `comment.config.twikoo.server_url`，最后设置 `comment.enable: true`；现有评论数据是否仍在服务端，需要在找到原服务后确认。

头像已保存在 `source/images/avatar.svg`，主题 JS/CSS/字体由本站提供，减少对第三方主题 CDN 的依赖。历史文章图片继续使用原图床，已将该图床的 HTTP 引用改为 HTTPS；图床和访问统计仍属于外部服务。

更多变更和验证记录见 [维护记录](docs/maintenance-2026-09.md)。
