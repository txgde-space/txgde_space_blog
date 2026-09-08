---
title: 【学习笔记】ns3(吉大Aquasim-Third Generation)Docker纯净安装
date: '2023-10-15 03:05:49'
draft: false
tags:
  - 吉林大学
  - 计算机网络
  - Aquasim
  - ns-3
  - 网络模拟器
categories:
  - 学习笔记
  - 研究生
description: "记录在 Ubuntu 18.04 Docker 容器中安装 ns-3 与 Aqua-Sim Third Generation 的依赖准备、安装和编译步骤。"
---
## 1 、拉取 Docker 镜像
推荐使用 Ubuntu:18.04 的镜像
``` Shell
docker run -it -p <host_data>:</home> --name ns3 ubuntu:18.04
```
## 2、下载必要软件包
``` shell
apt update
apt install vim
```
## 3、更换apt国内源(可选)
编辑 `/etc/apt/sources.list`
``` shell
vim /etc/apt/sources.list
```
Command模式下输入`:%s/archive.ubuntu.com/mirrors.ustc.edu.cn`，将官方源换为中科大源
`:wq`保存退出，输入`apt update`更新一下源
## 4 、下载吉大的开源仿真系统
**[官网:http://smartocean.jlu.edu.cn/info/1023/1096.htm](http://smartocean.jlu.edu.cn/info/1023/1096.htm)**
![](https://image.txgde.space/2023/10/26/6539c10f772e7.webp)
将其移动到<host_data>目录下在 host 主机解压或在 docker 中解压，如下：
[可选]
``` shell
apt install zip
unzip ns3.zip
```
[可选]
## 安装 ns3 依赖库
新建一个sh 脚本如`ns3_install.sh`(命令:`vim ns3_install.sh`)内容如下:
``` shell
#!/bin/sh
apt-get install gcc g++ python python3 -y
apt-get install gcc g++ python python3 python3-dev -y
apt-get install python3-setuptools git mercurial -y
apt-get install qt5-default mercurial -y
apt-get install gir1.2-goocanvas-2.0 python-gi python-gi-cairo python-pygraphviz python3-gi python3-gi-cairo python3-pygraphviz gir1.2-gtk-3.0 ipython ipython3 -y
apt-get install openmpi-bin openmpi-common openmpi-doc libopenmpi-dev -y
apt-get install autoconf cvs bzr unrar -y
apt-get install gdb valgrind -y
apt-get install uncrustify -y
apt-get install doxygen graphviz imagemagick -y
apt-get install texlive texlive-extra-utils texlive-latex-extra texlive-font-utils texlive-lang-portuguese dvipng latexmk -y
apt-get install python3-sphinx dia -y
apt-get install gsl-bin libgsl-dev libgsl23 libgslcblas0 -y
apt-get install tcpdump -y
apt-get install sqlite sqlite3 libsqlite3-dev -y
apt-get install libxml2 libxml2-dev -y
apt-get install cmake libc6-dev libc6-dev-i386 libclang-dev llvm-dev automake -y
apt-get install python-pip -y
pip install cxxfilt -y
apt-get install libgtk2.0-0 libgtk2.0-dev -y
apt-get install vtun lxc -y
apt-get install libboost-signals-dev libboost-filesystem-dev -y
apt-get install python-dev python-pygraphviz python-kiwi python-pygoocanvas python-gnome2 gir1.2-goocanvas-2.0 python-rsvg -y
```
`:wq`保存之后给予运行权限`chmod +x ns3_install.sh`
运行：`./ns3_install.sh`
等待安装完即可(可能会出现两个包因为 ubuntu 版本问题装不了，暂时没发现影响，待后续观察)
## 配置 并编译ns3
进入 ns3 目录，输入
``` shell
./waf --enable-examples --enable-tests configure
```
等待配置结束
然后输入`./waf`来编译插件
![](https://image.txgde.space/2023/10/26/6539c7fe48407.webp)
重点观察 aqua-sim-tg插件是否安装成功
然后输入下面代码来测试是否能够正常运行
``` shell
./waf --run test
```
![](https://image.txgde.space/2023/10/26/6539c8a13112d.webp)
出现以上内容则代表运行成功

## 使用说明
### 总体说明
aqua-sim-tg默认使用静态路由协议，路由表为 ns3/1.txt 文件，路由表项目格式为 (表项所属节 点地址 : 目的地址 : 下一跳地址)。例如表项 1:2:3表示节点1收到一个目的地址为2的包其下一 跳为节点3。
* 具体协议文件位于 ns3/src/aqua-sim-tg/model 目录下。
* 用户运行脚本位于 ns3/scratch 目录下。
### 增加协议
在 ns3/src/aqua-sim-tg/model 目录下增加协议源文件，在 ns3/src/aqua-sim-tg/wscript 文件中 写入新增协议文件名。
### 运行脚本
编写脚本之后，在 ns3 目录下使用 ./waf --run fileName 命令运行
### 例子
