---
title: '[CTFHub]Cookie'
date: '2021-09-18 16:36:06'
draft: false
categories: ['CTF']
tags: ['CTF', 'CTFHub', 'Easy', 'Web', 'Writeup']
description: "CTFHub Cookie 练习记录，观察浏览器中的 Cookie 字段，理解客户端状态与身份判断的关系。"
---

## 题目来源

[CTFHub>>技能树>>Web>>Web前置技能>>HTTP协议>>Cookie](https://www.ctfhub.com/#/skilltree)

## 前置知识

Cookie，有时也用其复数形式 Cookies。类型为“小型文本文件”，是某些网站为了辨别用户身份，进行Session跟踪而储存在用户本地终端上的数据（通常经过加密），由用户客户端计算机暂时或永久保存的信息. ——百度百科

## WriteUp

创建环境后打开链接,如图

![image-4-1024x286](https://image.txgde.space/2021/09/image-4-1024x286.png)

网站提示"hello guest, only admin can get flag",即只有admin才能获得flag.

根据本体题目可以看出应该跟cookie有关,打开审查元素-Application(应用程序)-Storage(储存)查看cookie,如图:

![image-5-1024x516](https://image.txgde.space/2021/09/image-5-1024x516.png)

可以看到cookie里有admin的字样,后面有个值为0的value,猜测将value的值修改为1即可伪造admin的身份拿到flag

双击修改value值为1并刷新网页:

![image-6-1024x633](https://image.txgde.space/2021/09/image-6-1024x633.png)

成功拿到Flag
