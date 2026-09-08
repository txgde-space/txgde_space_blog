---
title: 折腾 Ubuntu 随记
date: '2022-12-27 04:12:09'
categories:
  - 瞎折腾
tags:
  - Ubuntu
  - 个性化
draft:
---

狂推[Arch Wiki](https://wiki.archlinuxcn.org/)
### Ubuntu 22.10  Gnome43.5
#### Gnome插件[(官网)](https://extensions.gnome.org/)：
首先安装gnome-shell和gnome-shell-extension
插件列表
* *Clipboard Indicator ：剪切板历史
* Media Controls ： 音频控制
* Transparent Top Bar(Adjustable transparency) ：Top栏透明
* Fildem global menu ：全局菜单

#### 软件支持
##### 应用商店
* 星火应用商店(gui只能运行在x11下，wayland不能运行):https://spark-app.store/
* Flatpak:https://flatpak.org/setup/Ubuntu
##### Windows
微信：[deepin wine](https://github.com/zq1997/deepin-wine)(目前感觉最好用的)
原神：lutris+dawn
steam：设置-steam play
##### Android
xdorid(首选)
waydroid(很快，但是x86的Android软件支持差，且需要运行在wayland下，需要折腾)

#### 终端
##### zsh
	oh-my-zsh：
		主题：powerlevel10k
		插件：

#### mp4壁纸
使用xwinwrap
可使用该项目进行快捷配置[video-wallpaper](https://github.com/ghostlexly/gpu-video-wallpaper)

#### 罗技鼠标侧键的映射
1. 安装[Logiops](https://github.com/PixlOne/logiops)
	`sudo apt install logiops`
2. 检查键位devce id
	`logid -v`
3. 修改配置文件([教程](https://github.com/PixlOne/logiops/wiki/Configuration),[示例](https://github.com/PixlOne/logiops/blob/master/logid.example.cfg),[输入事件表](https://github.com/torvalds/linux/blob/master/include/uapi/linux/input-event-codes.h))
	`vim /etc/logid.cfg`
4. 创建service或重载service
	`sudo systemctl xxx logid`

#### 杂项
- Launcher中的项目存放在~/.local/share/applications或/usr/share/applications中
- login时执行命令可写在~/.profile中
- 切换x11和wayland： 取消自动登录，在输入密码界面的右下角的设置图标可以进行切换
