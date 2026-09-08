---
title: '[CTFHub]302跳转'
date: '2021-09-13 16:05:49'
draft: false
categories: ['CTF']
tags: ['CTF', 'CTFHub', 'Easy', 'Web', 'Writeup']
description: "通过 CTFHub 的 302 跳转练习理解 HTTP 重定向，并使用 curl 查看浏览器跳转前的响应。"
---

## 题目来源

[CTFHub>>技能树>>Web>>Web前置技能>>HTTP协议>>302跳转](https://www.ctfhub.com/#/skilltree)

## 前置知识

302重定向又称之为暂时性转移(Temporarily Moved )，英文名称：302 redirect。 也被认为是暂时重定向（temporary redirect），一条对网站浏览器的指令来显示浏览器被要求显示的不同的URL，当一个网页经历过短期的URL的变化时使用。一个暂时重定向是一种服务器端的重定向，能够被搜索引擎蜘蛛正确地处理。 ——百度百科

## WriteUp

创建环境后打开链接,如图

![1631520377-image](https://image.txgde.space/2021/09/1631520377-image.png)

首页(xxx/index.html)写着 **No Flag here** ,接着我们打开审查元素(F12)看看点击 **Give me Flag**(xxx/index.php) 链接会发生什么.

![1631520681-image](https://image.txgde.space/2021/09/1631520681-image.png)

发现当我们点击 **Give me Flag**(xxx/index.php) 时,页面又302重定向到index.html了.

因此猜测,只要我们阻止index.php重定向到index.html就可以拿到Flag了

这里我们利用curl默认不跟随重定向的特点来访问index.php

打开终端,输入`curl http://challenge-1cf1be6da3e0df53.sandbox.ctfhub.com:10800/index.php` (网址根据自身情况输入)

![1631520277-image](https://image.txgde.space/2021/09/1631520277-image.png)

成功拿到Flag
