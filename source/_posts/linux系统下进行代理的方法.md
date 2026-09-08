---
title: 'Linux系统下进行代理的方法'
date: '2022-02-10 12:40:36'
draft: false
categories: ['Linux']
tags: ['clash', 'kali', 'linux', 'pip代理', '代理', '未分类', '浏览器代理']
description: "记录 Linux 主机与虚拟机使用代理的方法，包括获取 Clash 代理地址、终端环境与常用工具配置。"
---

有代理的需求的时候，Windows和Mac系统还好，Linux会有些麻烦。每次在网上搜就会浪费很多时间,因此在此记录一下Linux系统下进行代理的方法。

## 获取代理地址

注:
**本文主要针对我已经有一台Windows主机开启Clash并允许lan的情况，并根据我自身的需求慢慢更新，地址请根据自身情况填写**

clash配置如下：

![image-20220210151221245](https://image.txgde.space/2022/02/image-20220210151221245.png)

开启Allow LAN，端口为7890

### clash运行在本地

那么代理地址就为`http://127.0.0.1:7890`

### clash运行在宿主机，虚拟机需要代理

可以通过命令行等获取到宿主机的ip地址，windows下使用`ipconfig`，如下：

![image-20220210152155150](https://image.txgde.space/2022/02/image-20220210152155150.png)

这里我们找到与虚拟机为同一个以太网适配器的IP地址，我这台的为`192.168.121.1`,那么虚拟机内所需要的代理地址为`http://192.168.121.1:7890`

### clash运行在其他主机上

运行clash的主机需要能够被访问到(在同一个局域网内或者有外网ip)，代理地址为`http://ip:7890`(根据自身情况填写)

### PS

代理地址写进环境变量后可以更方便地调用

## 终端代理

终端输入以下命令

``` shell
export http_proxy="http://127.0.0.1:7890"  
export https_proxy="http://127.0.0.1:7890"
```

**curl**等命令会用到

## 浏览器代理

### Firefox浏览器

Firefox浏览器可在设置里边直接打开代理选项进行手动代理配置即可

### Chrome浏览器

Chrome浏览器设置中没有图形化代理选项，但是可以通过终端命令的方式来以代理模式打开Chrome浏览器:

``` shell
google-chrome --proxy-server="socks://127.0.0.1:7890"
```

出现下列错误的原因可能是clash主机节点出现问题

``` shell
[118605:118619:0210/012450.301746:ERROR:ssl_client_socket_impl.cc(995)] handshake failed; returned -1, SSL error code 1, net_error -101  
[118605:118619:0210/012454.059174:ERROR:ssl_client_socket_impl.cc(995)] handshake failed; returned -1, SSL error code 1, net_error -101  
[118605:118619:0210/012456.287762:ERROR:ssl_client_socket_impl.cc(995)] handshake failed; returned -1, SSL error code 1, net_error -101  
[118605:118619:0210/012501.474005:ERROR:ssl_client_socket_impl.cc(995)] handshake failed; returned -1, SSL error code 1, net_error -101  
[118605:118619:0210/012503.692347:ERROR:ssl_client_socket_impl.cc(995)] handshake failed; returned -1, SSL error code 1, net_error -101  
[118605:118619:0210/012509.300136:ERROR:ssl_client_socket_impl.cc(995)] handshake failed; returned -1, SSL error code 1, net_error -101  
​
```

## pip代理

临时使用pip代理可以使用以下命令

``` shell
pip install xxxx --proxy="socks://127.0.0.1:7890"
```
