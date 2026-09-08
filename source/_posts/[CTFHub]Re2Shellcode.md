---
title: '[CTFHub]Re2Shellcode'
date: '2021-09-09 09:09:57'
draft: false
categories: ['CTF']
tags: ['CTFHub', 'CTF', 'Writeup', 'Re2Shellcode']
description: "CTFHub Re2Shellcode 练习笔记，记录程序保护检查、地址输出分析及 Shellcode 相关解题思路。"
---

## 查看程序保护机制

![image-20220223004540659](https://gitee.com/nobugs404/imgbed/raw/master//blog/image-20220223004540659.png)

## 分析程序流程

![image-20220223004839148](https://gitee.com/nobugs404/imgbed/raw/master//blog/image-20220223004839148.png)

输出中包含一个地址,然后让我们输入something,反汇编看一下:

![image-20220223010610944](https://gitee.com/nobugs404/imgbed/raw/master//blog/image-20220223010610944.png)

先来看下运行时输出的地址是什么,首先找到是40065c处的printf输出了地址

看下传进去的参数:rdi寄存器存的是`%rip+0xe2`指向存 `"What is it : [%p] ?\n"`这个字符串的地址, rsi寄存器存的是

## Pwn思路

## payload

![image-20220302210254334](/Users/thou/Library/Application Support/typora-user-images/image-20220302210254334.png)
