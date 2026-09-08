---
title: 【学习笔记】MongoDB笔记
date: '2022-10-17 23:12:09'
draft: 
categories:
  - 学习笔记
tags:
  - MongoDB
  - 数据库
---

## MacOS 命令
开启mongodb Server
```shell
brew services start mongodb-community@6.0
```
关闭mongodb Server
```shell
brew services stop mongodb-community@6.0
```



## 创建用户
mongoDB对某一个数据库进行操作需要先创建一个对该数据库有相关权限的用户
首先打开某一个数据库`use dbname`
输入`db.createUser({user:'username',pwd:'password',roles:[{role:'dbOwner',db:'dbname'},{role:'dbOwner',db:'dbname'}]})`

## 查询数据
### 查看数据库
`show databases`
### 查看有哪些表/集合
`show tables/show collections`
### 查看某一表中的全部内容
`db.table_name.find()`
