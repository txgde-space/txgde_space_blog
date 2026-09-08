---
title: 【学习笔记】ns3 核心概念的理解
date: '2023-10-19 02:41:23'
draft: 
categories:
  - 学习笔记
  - 研究生
tags:
  - ns-3
  - 计算机网络
  - 网络模拟器
description: "梳理 ns-3 中 Node、Net Device、Application、Channel 与 Helper 的含义及网络组件之间的关系。"
---
**[官方文档](https://www.nsnam.org/docs)**
## 各网络组件对现实生活网络的抽象
* Node(组件)
	可以抽象为现实生活中的一个网络终端
	![](https://image.txgde.space/2023/10/27/653b1d19effee.webp)
* Net Device(网络设备)
	可以抽象为终端中的网络硬件，如网卡
	![](https://image.txgde.space/2023/10/27/653b1d3e0521a.webp)
* Application(应用)
	可以抽象为终端中的应用程序
* Channel(信道)
	可以抽象为网线、 wifi 等连接各终端的设备
	![](https://image.txgde.space/2023/10/27/653b1cec127dd.webp)
* Helper(拓扑辅助程序)
	通过各种组件的 Helper 类可以批量地创建大量组件，如 Node 、 Net Device 等

## 各网络组件之间的关系
### 网络组件创建
先创建一个 Node，再在各 Node 中创建 Net Device 和 Application，最后再创建 Channel 供 Net Device 直接互相传输信息。
### 网络组件调用关系
Node终端中的 Application 调用该 Node 中的 Net Device 通过 Channel 与另外一个 Node 的 Net Device 进行连接，并将信息传输到另外一个 Node 中供另外一个 Node 的 Application 进行分析使用，关系图如下：
![](https://image.txgde.space/2023/10/27/653b168b5aa4b.webp)
