# 图片链接检查（2026-09-08）

检查 26 篇文章中 150 个去重后的外部图片地址，135 个返回成功图片响应，15 个需要处理。使用 HEAD，并对异常响应补充 GET（Range 请求），带正式博客 Referer。HTTP 成功不等同于逐张视觉校验，Gitee 拒绝访问也不代表文件一定已删除。

遗留博客目录中未找到这些文件名的本地副本。没有用猜测地址替换原图，也没有删除原文中的图片引用。

| 文章 | 图片地址 | 检查结果 |
| --- | --- | --- |
| [[CTFHub]Re2Shellcode.md](../source/_posts/%5BCTFHub%5DRe2Shellcode.md) | [gitee.com/nobugs404/imgbed/raw/master//blog/image-20220223004540659.png](https://gitee.com/nobugs404/imgbed/raw/master//blog/image-20220223004540659.png) | HTTP 403 |
| [[CTFHub]Re2Shellcode.md](../source/_posts/%5BCTFHub%5DRe2Shellcode.md) | [gitee.com/nobugs404/imgbed/raw/master//blog/image-20220223004839148.png](https://gitee.com/nobugs404/imgbed/raw/master//blog/image-20220223004839148.png) | HTTP 403 |
| [[CTFHub]Re2Shellcode.md](../source/_posts/%5BCTFHub%5DRe2Shellcode.md) | [gitee.com/nobugs404/imgbed/raw/master//blog/image-20220223010610944.png](https://gitee.com/nobugs404/imgbed/raw/master//blog/image-20220223010610944.png) | HTTP 403 |
| [ctfhubcookie.md](../source/_posts/ctfhubcookie.md) | [image.txgde.space/2021/09/image-4-1024x286.png](https://image.txgde.space/2021/09/image-4-1024x286.png) | HTTP 404 |
| [ctfhubcookie.md](../source/_posts/ctfhubcookie.md) | [image.txgde.space/2021/09/image-5-1024x516.png](https://image.txgde.space/2021/09/image-5-1024x516.png) | HTTP 404 |
| [ctfhubcookie.md](../source/_posts/ctfhubcookie.md) | [image.txgde.space/2021/09/image-6-1024x633.png](https://image.txgde.space/2021/09/image-6-1024x633.png) | HTTP 404 |
| [gef的安装.md](../source/_posts/gef%E7%9A%84%E5%AE%89%E8%A3%85.md) | [gitee.com/nobugs404/imgbed/raw/master//blog/image-20220210153453680.png](https://gitee.com/nobugs404/imgbed/raw/master//blog/image-20220210153453680.png) | HTTP 403 |
| [gef的安装.md](../source/_posts/gef%E7%9A%84%E5%AE%89%E8%A3%85.md) | [gitee.com/nobugs404/imgbed/raw/master//blog/image-20220210153549199.png](https://gitee.com/nobugs404/imgbed/raw/master//blog/image-20220210153549199.png) | HTTP 403 |
| [gef的安装.md](../source/_posts/gef%E7%9A%84%E5%AE%89%E8%A3%85.md) | [gitee.com/nobugs404/imgbed/raw/master//blog/image-20220210153658743.png](https://gitee.com/nobugs404/imgbed/raw/master//blog/image-20220210153658743.png) | HTTP 403 |
| [gef的安装.md](../source/_posts/gef%E7%9A%84%E5%AE%89%E8%A3%85.md) | [gitee.com/nobugs404/imgbed/raw/master//blog/image-20220210153720109.png](https://gitee.com/nobugs404/imgbed/raw/master//blog/image-20220210153720109.png) | HTTP 403 |
| [gef的安装.md](../source/_posts/gef%E7%9A%84%E5%AE%89%E8%A3%85.md) | [gitee.com/nobugs404/imgbed/raw/master//blog/image-20220210153749722.png](https://gitee.com/nobugs404/imgbed/raw/master//blog/image-20220210153749722.png) | HTTP 403 |
| [学习笔记计算机系统学习笔记week1-1.md](../source/_posts/%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E7%BB%9F%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0week1-1.md) | [blogcdn.txgde.space/blogimg/202207101800075.png](https://blogcdn.txgde.space/blogimg/202207101800075.png) | ENOTFOUND |
| [攻防世界web_php_include.md](../source/_posts/%E6%94%BB%E9%98%B2%E4%B8%96%E7%95%8Cweb_php_include.md) | [image.txgde.space/2021/09/image-1-1024x245.png](https://image.txgde.space/2021/09/image-1-1024x245.png) | HTTP 404 |
| [攻防世界web_php_include.md](../source/_posts/%E6%94%BB%E9%98%B2%E4%B8%96%E7%95%8Cweb_php_include.md) | [image.txgde.space/2021/09/image-2.png](https://image.txgde.space/2021/09/image-2.png) | HTTP 404 |
| [攻防世界web_php_include.md](../source/_posts/%E6%94%BB%E9%98%B2%E4%B8%96%E7%95%8Cweb_php_include.md) | [image.txgde.space/2021/09/image-3-1024x595.png](https://image.txgde.space/2021/09/image-3-1024x595.png) | HTTP 404 |

另有一处本机图片引用：`source/_posts/[CTFHub]Re2Shellcode.md` 中的 `/Users/thou/Library/Application Support/typora-user-images/image-20220302210254334.png`。它因地址包含未转义空格而显示为 Markdown 文本，需要找到原图后改为可访问的地址。

后续处理：从原图床或备份恢复这批图片。旧域名 `blogcdn.txgde.space` 需要恢复 DNS 或迁移对应图片；Gitee 的 8 张图建议在取得原文件后迁移到可公开访问的图床。

复查命令（先执行构建）：

```sh
npm run audit:images
```

结果默认写到 `/tmp/blog-image-audit.json`；也可通过 `npm run audit:images -- /tmp/custom-report.json` 指定输出位置。网络检查独立于 CI，避免外部图床波动阻塞发布。
