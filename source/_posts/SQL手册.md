---
title: SQL手册
date: '2022-10-30 04:38:09'
draft: 
categories:
  - 学习笔记
tags:
  - SQL
  - 数据库
  - MariaDB
  - Mysql
  - 关系型数据库
---
## 一、前言

## 二、语句

### **1、select**

```sql
select * from 表名;
或者
select 字段1,字段2  from 表名;
```

### **2、distinct**

```sql
select distinct 字段名 from 表名;
```

### **3、insert into**

```sql
insert into 表名(字段1,字段2) values(字段值1,字段值2)
```

### **4、update**

```sql
update 表名 set 字段1=字段值1,字段2=字段值2 where 查询条件
```

### **5、delete**

1、删除指定数据行

```sql
delete from 表名 where 查询条件
```

2、删除全部数据

```sql
delete from 表名;
 或
delete * from 表名;
```

### **6、select into**

```sql
mysql 数据库不支持 select ... into 语句，但支持 [insert into ... select]
#select into 语句从一个表复制数据，然后把数据插入到另一个新表中。
```

1、复制新表

```sql
select * into 新表名 from 表名
```

2、复制指定列到新表

```sql
select 字段名 into 新表名 from 表名 
```

3、只复制中国的网站插入到新表中：

```sql
select * into 新表名 from 表名 where ‘web’ = ‘中国’
```

4、复制多个表中的数据插入到新表中

```sql
select 表1.字段名,表2.字段名 into 新表名
from 表1 left join 表2 on 表1.id = 表2.id
```

5、复制一个空表

```sql
select * into 新表名 from 表名 where 1=0;
```

### **7、insert into select**

```sql
#select into from 和 insert into select 都是用来复制表。
#两者的主要区别为：
#select into from 要求目标表不存在，因为在插入时会自动创建；
#insert into select from 要求目标表存在。
```

1、从一个表中复制所有的列插入到另一个已存在的表中

```sql
insert into 表名select * from 要复制的表名;
```

2、复制指定的列插入到另一个已存在的表中

```sql
insert into 表1(表1.字段1，表1.字段2)
select 表2.字段1,表2.字段2 from 表2;
```

### **8、create database**

```sql
//创建数据库
create database 数据库名;
```

### **9、create table**

```sql
//创建数据表
create table 表名 
(
 字段名 字段类型（最大长度）
)
```

### 10、alter table

添加列

```sql
alter table 表名 add 列名 字段类型(int) 是否为空(not null) 默认值(default)
```

删除列

```sql
alter table 表名 drop column 列名
```

改变列

1、sql server / ms access：

```sql
alter table 表名 alter column 列名 字段类型
```

2、my sql / oracle：

```sql
alter table 表名modify column 列名 字段类型
```

3、oracle 10g 之后版本:

```sql
alter table 表名 modify 列名 字段类型
```

### 11、group by

```
用于结合聚合函数，根据一个或多个列对结果集进行分组。
```

```sql
select column_name, aggregate_function(column_name) from table_name 
where column_name = value 
group by column_name;
```

## 三、子句

### **1、where**

1、文本字段

```sql
select * from 表名where 字段名='1';
```

2、数值字段

```sql
select * from 表名 where 字段名=1;
```

3、运算符

| 运算符  | 描述                                                   |
| ------- | ------------------------------------------------------ |
| =       | 等于                                                   |
| <>      | 不等于。注释：在 SQL 的一些版本中，该操作符可被写成 != |
| >       | 大于                                                   |
| <       | 小于                                                   |
| >=      | 大于等于                                               |
| <=      | 小于等于                                               |
| BETWEEN | 在某个范围内                                           |
| LIKE    | 搜索某种模式                                           |
| IN      | 指定针对某个列的多个可能值                             |

### **2、top 和 limit**

（1）、返回前2行记录

```sql
select top 2 * from 表名;

select * from 表名 limit 2;
```

（2）、返回第3到10行的记录

```sql
select top 10 * from 表名 where 字段名 not in (select top 3 字段名 from 表名)

select * from 表名 limit 3,7
```

（3）、返回50%的记录

```sql
select top 50 percent * from 表名;
```

### 3、having

```
having 可以理解为group 的 where语句 
在 sql 中增加 having 子句原因是，where 关键字无法与聚合函数一起使用。
having 子句可以让我们筛选分组后的各组数据。
```

having 语法

```sql
select column_name, aggregate_function(column_name) from table_name 
where column_name operator value 
group by column_name 
having aggregate_function(column_name) operator value;
```

## 四、运算符

### **1、and & or**

1、如果第一个条件和第二个条件都成立，则 and 运算符显示一条记录。

```sql
select * from 表名 where name='张三' and sex ='男';
```

2、如果第一个条件和第二个条件中只要有一个成立，则 or 运算符显示一条记录。

```sql
select * from 表名 where name='张三' or name ='李四';
```

3、您也可以把 and 和 or 结合起来（使用圆括号来组成复杂的表达式）。

```sql
select * from 表名 where (name='张三' or name ='李四') and sex ='男';
```

### 2、exists 

```
运算符用于判断查询子句是否有记录，如果有一条或多条记录存在返回 true，否则返回 false。
```

sql exists 语法

```sql
select column_name(s)
from table_name
where exists(select column_name from table_name where condition);
```

## 五、关键字

### **1、order by** 

1、正序排列

```sql
select * from 表名 order by 字段名;
select * from 表名 order by 字段名 asc;
```

2、倒序排列

```sql
select * from 表名 order by 字段名 desc;
```

## 六、操作符

### 1、like

1、查询以a开头的数据

```sql
select * from 表名 where 字段 like 'a%';
```

2、查询以a结尾的数据

```sql
select * from 表名 where 字段 like '%a';
```

3、查询包含a的所有数据

```sql
select * from 表名 where 字段 like '%a%';
```

4、查询不包含a的所有数据

```sql
select * from 表名 where 字段 not like '%a%';
```

5、查询一个任意字符开始，然后是 "a" 的所有数据

```sql
select * from 表名 where 字段 like '_a';
```

6、查询一个任意字符开始，然后是 "a_c_e" 的所有数据

```sql
select * from 表名 where 字段 like 'a_c_e';
```

7、查询以a或者b或者c开始的所有数据

```sql
select * from 表名 where 字段 like '^[abc]';
```

8、查询以a-z开头的所有数据

```sql
select * from 表名 where 字段 like '^[a-z]';
```

9、查询不以a-z开头的所有数据

```sql
select * from 表名 where 字段 like '^[^a-z]';
```

### **2、in**

查询结果为a或者b的数据

```sql
select * from 表名 where 字段 in (‘a’,’b’)
```

### **3、between**

```sql
#选取介于两个值之间的数据范围内的值。这些值可以是数值、文本或者日期。
```

1、查询1-20之间的所有数据

```sql
select * from 表名 where 字段名 between 1 and 20;
```

2、查询不在1-20之间的所有数据

```sql
select * from 表名 where 字段名 not between 1 and 20;
```

3、查询1-20之间并且值不为a、b、c的所有数据

```sql
select * from 表名 where 字段名 (between 1 and 20) and 字段名 not in(‘a’,’b’,’c’);
```

4、查询'a' 和 'h' 之间字母开始的所有数据

```sql
select * from 表名 where 字段名 between ‘a’ and ‘h’;
```

5、查询不在'a' 和 'h' 之间字母开始的所有数据

```sql
select * from 表名 where 字段名 not between ‘a’ and ‘h’;
```

6、查询日期在'2021-01-01' 和 '2022-01-01' 之间的所有数据：

```sql
select * from 表名 where 字段名 not between ‘2021-01-01’ and ‘2022-01-01’;
```

### **4、union**

```sql
#union 操作符用于合并两个或多个 select 语句的结果集。
#请注意，union 内部的每个 select 语句必须拥有相同数量的列。列也必须拥有相似的数据类型。同时，每个 select 语句中的列的顺序必须相同。
#注释：默认地，union 操作符选取不同的值。如果允许重复的值，请使用 union all。
```

1、union 获取不重复的值

```sql
select 字段1,字段2 from 表名
union
select 字段1,字段2 from 表名
order by 字段1;
```

2、union all 获取所有的值（包含重复的）

```sql
select 字段1,字段2 from 表名
union all
select 字段1,字段2 from 表名
order by 字段1;
```



## 七、别名

### **1、as**

1、表别名

```sql
select * from 表名 as 别名
```

2、列别名

```sql
select 字段1 as 别名 from 表名
```

3、混合别名

```sql
select 

表1别名.字段名,

表2别名.字段名 

from 

表1 as 表1别名,

表2 as 表2别名
```

## 八、join

```sql
#join 子句用于把来自两个或多个表的行结合起来，基于这些表之间的共同字段。
```

### 1、inner join

```
如果表中有至少一个匹配，则返回行
```

```sql
select 

表1.字段名,

表2.字段名

from 表1 inner join 表2 on 表1.id=表2.id;
```

### 2、left join

```
即使右表中没有匹配，也从左表返回所有的行
```

```sql
select 

表1.字段名,

表2.字段名

from 表1 left join 表2 on 表1.id=表2.id;
```

### 3、right join

```
即使左表中没有匹配，也从右表返回所有的行
```

```sql
select 

表1.字段名,

表2.字段名

from 表1 right join 表2 on 表1.id=表2.id;
```

### 4、full join

```
只要其中一个表中存在匹配，则返回行（mysql不支持）
```

```sql
select 

表1.字段名,

表2.字段名

from 表1 full outer join 表2 on 表1.id=表2.id;
```

## 九、约束

```sql
create table 表名 
(
 字段名 字段类型（最大长度）约束
)

#在 sql 中，我们有如下约束：
#1、not null - 指示某列不能存储 null 值。
#2、unique - 保证某列的每行必须有唯一的值。
#3、primary key - not null 和 unique 的结合。确保某列（或两个列多个列的结合）有唯一标识，有助于更容易更快速地找到表中的一个特定的记录。
#4、foreign key - 保证一个表中的数据匹配另一个表中的值的参照完整性。
#5、check - 保证列中的值符合指定的条件。
#6、default - 规定没有给列赋值时的默认值。
```

### **1、not null**

```sql
#not null 约束强制列不接受 null 值。
#not null 约束强制字段始终包含值。这意味着，如果不向字段添加值，就无法插入新记录或者更新记录。
```

1、添加 not null 约束

```sql
alter table 表名 modify 字段名 int not null;
```

2、删除 not null 约束

```sql
alter table 表名 modify 字段名 int  null;
```

### **2、unique**

```sql
#unique 约束唯一标识数据库表中的每条记录。
#unique 和 primary key 约束均为列或列集合提供了唯一性的保证。
#primary key 约束拥有自动定义的 unique 约束。
#请注意，每个表可以有多个 unique 约束，但是每个表只能有一个 primary key 约束。
```

**（1）、创建表时，添加约束**

1、mysql

```sql
create table 表名
(
 p_id int not null,
 unique (p_id)
)
```

2、sql server / oracle / ms access

```sql
create table 表名
(
 p_id int not null unique,
)
```

```sql
#如需命名 unique 约束，并定义多个列的 unique 约束，请使用下面的 sql 语法：
```

3、mysql / sql server / oracle / ms access：

```sql
create table 表名
(
 p_id int not null,
 lastname varchar(255) not null,
 constraint uc_personid=约束名 unique (p_id,lastname)
)
```

**（2）、表已存在时，添加约束**

1、当表已被创建时，如需在 "p_id" 列创建 unique 约束，请使用下面的 sql：

mysql / sql server / oracle / ms access：

```sql
alter table 表名 add unique (p_id)
```

2、如需命名 unique 约束，并定义多个列的 unique 约束，请使用下面的 sql 语法：

mysql / sql server / oracle / ms access：

```sql
alter table 表名 add constraint uc_personid=约束名 unique (p_id,lastname)
```

**（3）、表已存在时，撤销约束**

1、mysql：

```sql
alter table 表名 drop index uc_personid=约束名
```

2、sql server / oracle / ms access：

```sql
alter table 表名 drop constraint uc_personid=约束名
```

### **3、primary key**

```sql
#primary key 约束唯一标识数据库表中的每条记录。
#主键必须包含唯一的值。
#主键列不能包含 null 值。
#每个表都应该有一个主键，并且每个表只能有一个主键。
```

**（1）、创建表时，添加约束**

1、mysql

```sql
create table 表名
(
 p_id int not null,
 primary key (p_id)
)
```

2、sql server / oracle / ms access

```sql
create table 表名
(
 p_id int not null primary key,
)
```

3、如需命名 unique 约束，并定义多个列的 unique 约束，请使用下面的 sql 语法：

mysql / sql server / oracle / ms access：

```sql
create table 表名
(
 p_id int not null,
 lastname varchar(255) not null,
 constraint pk_personid=约束名 primary key  (p_id,lastname)
)
```

**（2）、表已存在时，添加约束**

1、当表已被创建时，如需在 "p_id" 列创建 primary key 约束，请使用下面的 sql：

mysql / sql server / oracle / ms access：

```sql
alter table 表名 add primary key  (p_id)
```

2、如需命名 unique 约束，并定义多个列的 primary key 约束，请使用下面的 sql 语法：

mysql / sql server / oracle / ms access：

```sql
alter table 表名 add constraint pk_personid=约束名 primary key  (p_id,lastname)
```

**（3）、表已存在时，撤销约束**

1、mysql：

```sql
alter table 表名 drop primary key
```

2、sql server / oracle / ms access：

```sql
alter table 表名 drop constraint pk_personid=约束名
```

### **4、foreign key**

```sql
#一个表中的 foreign key 指向另一个表中的 unique key(唯一约束的键)。
```

**（1）、创建表时添加约束**

1、mysql：

```sql
create table 表1
(
 o_id int not null,
 orderno int not null,
 p_id int,
 primary key (o_id),
 foreign key (p_id) references 表2(p_id)
)
```

2、sql server / oracle / ms access：

```sql
create table 表1
(
 o_id int not null primary key,
 orderno int not null,
 p_id int foreign key references 表2(p_id)
)
```

3、如需命名 foreign key 约束，并定义多个列的 foreign key 约束，请使用下面的 sql 语法：

mysql / sql server / oracle / ms access：

```sql
create table 表1(
 o_id int not null,
 orderno int not null,
 p_id int,
 primary key (o_id),
 constraint fk_perorders=约束名 foreign key (p_id)
 references 表2(p_id)
)
```

**（2）、表已存在时，添加约束**

1、mysql / sql server / oracle / ms access：

```sql
alter table 表1 add foreign key (p_id) references 表2(p_id)
```

如需命名 foreign key 约束，并定义多个列的 foreign key 约束，请使用下面的 sql 语法：

2、mysql / sql server / oracle / ms access：

```sql
alter table 表1
add constraint fk_perorders=约束名
foreign key (p_id)
references 表2(p_id)
```

**（3）、表已存在时，撤销约束**

1、mysql：

```sql
alter table 表1 drop foreign key fk_perorders
```

2、sql server / oracle / ms access：

```sql
alter table 表1 drop constraint fk_perorders
```

### **5、check**

```sql
#check 约束用于限制列中的值的范围。
#如果对单个列定义 check 约束，那么该列只允许特定的值。
#如果对一个表定义 check 约束，那么此约束会基于行中其他列的值在特定的列中对值进行限制。
```

**（1）、创建表时添加约束**

1、mysql：

```sql
create table 表名
(
 p_id int not null,
 check (p_id>0)
)
```

2、sql server / oracle / ms access：

```sql
create table 表
(
 p_id int not null check (p_id>0),
)
```

3、如需命名 check 约束，并定义多个列的 check 约束，请使用下面的 sql 语法：

mysql / sql server / oracle / ms access：

```sql
create table persons
(
 p_id int not null,
 city varchar(255),
 constraint chk_person=约束名 check (p_id>0 and city='sandnes')
)
```

**（2）、表已存在时，添加约束**

1、mysql / sql server / oracle / ms access:

```sql
alter table 表名 add check (p_id>0)
```

2、如需命名 check 约束，并定义多个列的 check 约束，请使用下面的 sql 语法：

mysql / sql server / oracle / ms access：

```sql
alter table 表名add constraint chk_person=约束名 check (p_id>0 and city='sandnes')
```

**（3）、表已存在时，撤销约束**

1、sql server / oracle / ms access：

```sql
alter table 表名drop constraint chk_person=约束名
```

2、mysql：

```sql
alter table 表名 drop check chk_person=约束名
```

### **6、default**

```sql
#default 约束用于向列中插入默认值。
#如果没有规定其他的值，那么会将默认值添加到所有的新记录。
```

 **（1）、创建表时添加约束**

1、**my sql / sql server / oracle / ms access：**

```sql
create table 表名
(
    city varchar(255) default '我是默认值'
)
```

2、通过使用类似 getdate() 这样的函数，default 约束也可以用于插入系统值：

```sql
create table orders
(
    orderdate date default getdate()
)
```

**（2）、表已存在时，添加约束**

1、mysql：

```sql
alter table 表名
alter 字段名 set default '我是默认值'
```

2、sql server / ms access：

```sql
alter table 表名
add constraint ab_c default '我是默认值' for city
```

3、oracle：

```sql
alter table 表名
modify 字段名 default '我是默认值'
```

**（3）、表已存在时，撤销约束**

**1、mysql：**

```sql
alter table 表名
alter 字段名 drop default
```

**2、sql server / oracle / ms access：**

```sql
alter table 表名
alter column 字段名 drop default
```

## 十、索引

```sql
#create index 语句用于在表中创建索引。
#在不读取整个表的情况下，索引使数据库应用程序可以更快地查找数据。
#可以把索引当作新华字典的音序表，例如，要查“库”字，如果不使用音序，就需要从字典的 400 页中逐页来找。但是，如果提取拼音出来，构成音序表，就只需要从 10 多页的音序表中直接查找。这样就可以大大节省时间。
#索引可以提高查询速度，但是会影响插入记录的速度。因为，向有索引的表中插入记录时，数据库系统会按照索引进行排序，这样就降低了插入记录的速度，插入大量记录时的速度影响会更加明显。这种情况下，最好的办法是先删除表中的索引，然后插入数据，插入完成后，再创建索引。
```

1、sql create index 语法

```sql
#在表上创建一个简单的索引。允许使用重复的值：
create index index_name=索引名 on 表名 (字段名)
```

2、sql create unique index 语法

```sql
#在表上创建一个唯一的索引。不允许使用重复的值：唯一的索引意味着两个行不能拥有相同的索引值。
create unique index index_name=索引名 on 表名 (字段名)
#注释：用于创建索引的语法在不同的数据库中不一样。因此，检查您的数据库中创建索引的语法。
```

3、create index 实例
（1）、下面的 sql 语句在 "persons" 表的 "lastname" 列上创建一个名为 "pindex" 的索引：

```sql
create index pindex on persons (lastname)
```

（2）、如果您希望索引不止一个列，您可以在括号中列出这些列的名称，用逗号隔开：

```sql
create index pindex on persons (lastname, firstname)
```

4、什么时候需要创建索引

```
（1）、主键自动建立唯一索引
（2）、频繁作为查询条件的字段应该创建索引
（3）、查询中排序的字段创建索引将大大提高排序的速度（索引就是排序加快速查找
（4）、查询中统计或者分组的字段；
```

5、什么时候不需要创建索引

```
（1）、频繁更新的字段不适合创建索引，因为每次更新不单单是更新记录，还会更新索引，保存索引文件
（2）、where条件里用不到的字段，不创建索引；
（3）、表记录太少，不需要创建索引；
（4）、经常增删改的表；
（5）、数据重复且分布平均的字段，因此为经常查询的和经常排序的字段建立索引。注意某些数据包含大量重复数据，因此他建立索引就没有太大的效果，例如性别字段，只有男女，不适合建立索引。
```

## 十二、删除、清空

### 1、删除索引

1、用于 MS Access 的 DROP INDEX 语法：

```sql
drop index 索引名称 on 表名
```

2、用于 MS SQL Server 的 DROP INDEX 语法：

```sql
drop index 表名.索引名称
```

3、用于 DB2/Oracle 的 DROP INDEX 语法：

```sql
drop index 索引名称
```

4、用于 MySQL 的 DROP INDEX 语法：

```sql
alter table 表名 drop index 索引名称
```

### 2、删除表

```sql
drop table 表名
```

### 3、删除数据库

```sql
drop database 数据库名
```

### 4、清空表

```sql
truncate table 表名
```

## 十三、自动递增和标识列

#### 1、用于 mysql 的语法

（1）、下面的 sql 语句把 "persons" 表中的 "id" 列定义为 auto-increment 主键字段：

```sql
create table persons
(
id int not null auto_increment
)
```

mysql 使用 auto_increment 关键字来执行 auto-increment 任务。
默认地，auto_increment 的开始值是 1，每条新记录递增 1。
（2）、要让 auto_increment 序列以其他的值起始，请使用下面的 sql 语法：

```sql
alter table persons auto_increment=100
```

#### 2、用于 sql server 的语法

（1）、下面的 sql 语句把 "persons" 表中的 "id" 列定义为 auto-increment 主键字段：

```sql
create table persons
(
id int identity(1,1) primary key
)
```

ms sql server 使用 identity 关键字来执行 auto-increment 任务。
在上面的实例中，identity 的开始值是 1，每条新记录递增 1。
提示：要规定 "id" 列以 10 起始且递增 5，请把 identity 改为 identity(10,5)。

#### 3、用于 access 的语法

下面的 sql 语句把 "persons" 表中的 "id" 列定义为 auto-increment 主键字段：

```sql
create table persons
(
id integer primary key autoincrement
)
```

ms access 使用 autoincrement 关键字来执行 auto-increment 任务。
默认地，autoincrement 的开始值是 1，每条新记录递增 1。
提示：要规定 "id" 列以 10 起始且递增 5，请把 autoincrement 改为 autoincrement(10,5)。

#### 4、用于 oracle 的语法

在 oracle 中，代码稍微复杂一点。
您必须通过 sequence 对象（该对象生成数字序列）创建 auto-increment 字段。
请使用下面的 create sequence 语法：

```sql
create sequence seq_person
minvalue 1
start with 1
increment by 1
cache 10
```

上面的代码创建一个名为 seq_person 的 sequence 对象，它以 1 起始且以 1 递增。该对象缓存 10 个值以提高性能。cache 选项规定了为了提高访问速度要存储多少个序列值。

## 十四、视图

### 1、创建视图

```sql
create view 视图名 as select 列名 from 表名 where 条件
```

### 2、更新视图

```sql
create or replace view 视图名 as select 列名 from 表名 where 条件
```

### 3、删除视图

```sql
drop view 视图名
```

### 4、更新视图

#### 1、create or replace view

```sql
create or replace view view_name as
select column_name(s)
from table_name
where condition
```

#### 2、sql server（更新视图）

```sql
alter view [ schema_name . ] 视图名 [ ( column [ ,...n ] ) ]
[ with <view_attribute> [ ,...n ] ] 
as select_statement 
[ with check option ] [ ; ]
<view_attribute> ::= { 
  [ encryption ]
  [ schemabinding ]
  [ view_metadata ]   
} 
```

schema_name: 视图所属架构的名称。

view_name: 要更改的视图。

column: 将成为指定视图的一部分的一个或多个列的名称（以逗号分隔）。

1、返回调用方的默认架构的名称

```sql
select schema_name();
go
```

 2、使用 id 返回架构的名称

```sql
use 数据库名;
select schema_name(1);
```

## 十五、函数

### 1、date

#### （1）、mysql date

下面的表格列出了 mysql 中最重要的内建日期函数：

```sql
now()    		//返回当前的日期和时间
curdate() 		//返回当前的日期
curtime() 		//返回当前的时间
date() 			//提取日期或日期/时间表达式的日期部分
extract() 		//返回日期/时间的单独部分
date_add() 		//向日期添加指定的时间间隔
date_sub() 		//从日期减去指定的时间间隔
datediff() 		//返回两个日期之间的天数
date_format() 	//用不同的格式显示日期/时间
```

#### （2）、sql server date

下面的表格列出了 sql server 中最重要的内建日期函数：

```sql
getdate() 		//返回当前的日期和时间
datepart()		//返回日期/时间的单独部分
dateadd()		//在日期中添加或减去指定的时间间隔
datediff()		//返回两个日期之间的时间
convert()		//用不同的格式显示日期/时间
```

sql date 数据类型
1、mysql 使用下列数据类型在数据库中存储日期或日期/时间值：

```sql
date - 格式：		yyyy-mm-dd
datetime - 格式：	yyyy-mm-dd hh:mm:ss
timestamp - 格式：	yyyy-mm-dd hh:mm:ss
year - 格式：		yyyy 或 yy
```

2、sql server 使用下列数据类型在数据库中存储日期或日期/时间值：

```sql
date - 格式：				yyyy-mm-dd
datetime - 格式：			yyyy-mm-dd hh:mm:ss
smalldatetime - 格式：		yyyy-mm-dd hh:mm:ss
timestamp - 格式：唯一的数字
```

注释：当您在数据库中创建一个新表时，需要为列选择数据类型！

### 2、null

1、查询列中带有 null 值的记录

```
select 列名 from 表名 where 列名 is null
```

2、查询列中不带有null值的记录

```
select 列名 from 表名 where 列名 is not null
```

3、不同数据库判断null的函数

请看下面的 "products" 表：

| p_id | productname | unitprice | unitsinstock | unitsonorder |
| ---- | ----------- | --------- | ------------ | ------------ |
| 1    | jarlsberg   | 10.45     | 16           | 15           |
| 2    | mascarpone  | 32.56     | 23           |              |
| 3    | gorgonzola  | 15.67     | 9            | 20           |

 

### 3、isnull()、nvl()、ifnull()和coalesce()

微软的 isnull() 函数用于规定如何处理 null 值。

nvl()、ifnull() 和 coalesce() 函数也可以达到相同的结果。

在这里，我们希望 null 值为 0。

下面，如果 "unitsonorder" 是 null，则不会影响计算，因为如果值是 null 则 isnull() 返回 0：

1、sql server / ms access

```sql
select productname,unitprice*( unitsinstock + isnull(unitsonorder,0) ) from products
```

2、oracle

oracle 没有 isnull() 函数。不过，我们可以使用 nvl() 函数达到相同的结果：

```sql
select productname,unitprice*(unitsinstock + nvl(unitsonorder,0)) from products
```

3、mysql

mysql 也拥有类似 isnull() 的函数。不过它的工作方式与微软的 isnull() 函数有点不同。

在 mysql 中，我们可以使用 ifnull() 函数，如下所示：

```sql
select productname,unitprice*(unitsinstock+ifnull(unitsonorder,0)) from products
```

或者我们可以使用 coalesce() 函数，如下所示：

```sql
select productname,unitprice*(unitsinstock + coalesce(unitsonorder,0)) from products
```

### 4、avg() 

```sql
//函数返回数值列的平均值。
select avg(列名) from 表名
```

### 5、count()

```
函数返回匹配指定条件的行数
```

1、sql count(column_name) 语法

count(column_name) 函数返回指定列的值的数目（null 不计入）：

```sql
select count(column_name) from table_name;
```

2、sql count(*) 语法

count(*) 函数返回表中的记录数：

```sql
select count(*) from table_name;s
```

3、sql count(distinct column_name) 语法

count(distinct column_name) 函数返回指定列的不同值的数目：

```sql
select count(distinct column_name) from table_name;
```

注释：count(distinct) 适用于 oracle 和 microsoft sql server，但是无法用于 microsoft access。

### 6、first() 

```
函数返回指定的列中第一个记录的值。
```

1、ms access first() 语法

```sql
select first(column_name) from table_name;
```

注释：只有 ms access 支持 first() 函数。

2、sql server 语法

```sql
select top 1 column_name from table_name order by column_name asc;
```

3、mysql 语法

```sql
select column_name from table_name order by column_name asc limit 1;
```

4、oracle 语法

```sql
select column_name from table_name order by column_name asc where rownum <=1;
```

7、last() 

```
函数返回指定的列中最后一个记录的值。
```

1、ms access last() 语法

```sql
select last(column_name) from table_name;
```

注释：只有 ms access 支持 last() 函数。

2、sql server 语法

```sql
select top 1 column_name from table_name order by column_name desc;
```

3、mysql 语法

```sql
select column_name from table_name order by column_name desc limit 1;
```

4、oracle 语法

```sql
select column_name from table_name order by column_name desc where rownum <=1;
```

### 7、max() 

```
函数返回指定列的最大值。
```

```sql
select max(column_name) from table_name;
```

### 8、min() 

```
函数返回指定列的最小值
```

```sql
select min(column_name) from table_name;
```

### 9、sum() 

```
函数返回数值列的总数。
```

```sql
select sum(column_name) from table_name;
```

### 10、ucase() 

```
函数把字段的值转换为大写。
```

1、sql ucase() 语法

```sql
select ucase(column_name) from table_name;
```

2、用于 sql server 的语法

```sql
select upper(column_name) from table_name;
```

### 11、lcase() 

```
函数把字段的值转换为小写。
```

1、sql lcase() 语法

```sql
select lcase(column_name) from table_name;
```

2、用于 sql server 的语法

```sql
select lower(column_name) from table_name;
```

### 12、mid() 

```
函数用于从文本字段中提取字符。
```

sql mid() 语法

```
select mid(column_name,start[,length]) from table_name;
```

| 参数        | 描述                                                        |
| ----------- | ----------------------------------------------------------- |
| column_name | 必需。要提取字符的字段。                                    |
| start       | 必需。规定开始位置（起始值是 1）。                          |
| length      | 可选。要返回的字符数。如果省略，则 mid() 函数返回剩余文本。 |

### 13、len() 

```
函数返回文本字段中值的长度。
```

1、sql len() 语法

```sql
select len(column_name) from table_name;
```

2、mysql 中函数为 length():

```sql
select length(column_name) from table_name;
```

### 14、round() 

```
函数用于把数值字段舍入为指定的小数位数。
```

sql round() 语法

```sql
select round(column_name,decimals) from table_name;
```

| 参数        | 描述                         |
| ----------- | ---------------------------- |
| column_name | 必需。要舍入的字段。         |
| decimals    | 可选。规定要返回的小数位数。 |

### 15、now() 

```
函数返回当前系统的日期和时间。
```

sql now() 语法

```sql
select now() from table_name;
```

16、format() 

```
函数用于对字段的显示进行格式化。
```

sql format() 语法

```sql
select format(column_name,format) from table_name;
```

| 参数        | 描述                   |
| ----------- | ---------------------- |
| column_name | 必需。要格式化的字段。 |
| format      | 必需。规定格式。       |

## 十六、数据类型

### 1、sql 通用数据类型

数据库表中的每个列都要求有名称和数据类型。each column in a database table is required to have a name and a data type.

sql 开发人员必须在创建 sql 表时决定表中的每个列将要存储的数据的类型。数据类型是一个标签，是便于 sql 了解每个列期望存储什么类型的数据的指南，它也标识了 sql 如何与存储的数据进行交互。

下面的表格列出了 sql 中通用的数据类型：

| 数据类型                              | 描述                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| character(n)                          | 字符/字符串。固定长度 n。                                    |
| varchar(n)  或   character varying(n) | 字符/字符串。可变长度。最大长度 n。                          |
| binary(n)                             | 二进制串。固定长度 n。                                       |
| boolean                               | 存储 true 或 false 值                                        |
| varbinary(n)  或   binary varying(n)  | 二进制串。可变长度。最大长度 n。                             |
| integer(p)                            | 整数值（没有小数点）。精度 p。                               |
| smallint                              | 整数值（没有小数点）。精度 5。                               |
| integer                               | 整数值（没有小数点）。精度 10。                              |
| bigint                                | 整数值（没有小数点）。精度 19。                              |
| decimal(p,s)                          | 精确数值，精度 p，小数点后位数 s。例如：decimal(5,2) 是一个小数点前有 3 位数，小数点后有 2 位数的数字。 |
| numeric(p,s)                          | 精确数值，精度 p，小数点后位数 s。（与 decimal 相同）        |
| float(p)                              | 近似数值，尾数精度 p。一个采用以 10 为基数的指数计数法的浮点数。该类型的 size 参数由一个指定最小精度的单一数字组成。 |
| real                                  | 近似数值，尾数精度 7。                                       |
| float                                 | 近似数值，尾数精度 16。                                      |
| double  precision                     | 近似数值，尾数精度 16。                                      |
| date                                  | 存储年、月、日的值。                                         |
| time                                  | 存储小时、分、秒的值。                                       |
| timestamp                             | 存储年、月、日、小时、分、秒的值。                           |
| interval                              | 由一些整数字段组成，代表一段时间，取决于区间的类型。         |
| array                                 | 元素的固定长度的有序集合                                     |
| multiset                              | 元素的可变长度的无序集合                                     |
| xml                                   | 存储 xml 数据                                                |

###  **2、sql 数据类型快速参考手册**

然而，不同的数据库对数据类型定义提供不同的选择。

下面的表格显示了各种不同的数据库平台上一些数据类型的通用名称：

| 数据类型           | access                     | sqlserver                                                 | oracle             | mysql         | postgresql         |
| ------------------ | -------------------------- | --------------------------------------------------------- | ------------------ | ------------- | ------------------ |
| boolean            | yes/no                     | bit                                                       | byte               | n/a           | boolean            |
| integer            | number  (integer)          | int                                                       | number             | int   integer | int   integer      |
| float              | number  (single)           | float   real                                              | number             | float         | numeric            |
| currency           | currency                   | money                                                     | n/a                | n/a           | money              |
| string  (fixed)    | n/a                        | char                                                      | char               | char          | char               |
| string  (variable) | text  (<256)   memo (65k+) | varchar                                                   | varchar   varchar2 | varchar       | varchar            |
| binary  object     | ole  object memo           | binary  (fixed up to 8k)   varbinary (<8k)   image (<2gb) | long   raw         | blob   text   | binary   varbinary |

### **3、microsoft access**

| 数据类型       | 描述                                                         | 存储     |
| -------------- | ------------------------------------------------------------ | -------- |
| text           | 用于文本或文本与数字的组合。最多 255 个字符。                |          |
| memo           | memo  用于更大数量的文本。最多存储 65,536 个字符。注释：无法对 memo 字段进行排序。不过它们是可搜索的。 |          |
| byte           | 允许 0 到 255 的数字。                                       | 1  字节  |
| integer        | 允许介于 -32,768 与 32,767 之间的全部数字。                  | 2  字节  |
| long           | 允许介于 -2,147,483,648 与 2,147,483,647 之间的全部数字。    | 4  字节  |
| single         | 单精度浮点。处理大多数小数。                                 | 4  字节  |
| double         | 双精度浮点。处理大多数小数。                                 | 8  字节  |
| currency       | 用于货币。支持 15 位的元，外加 4 位小数。提示：您可以选择使用哪个国家的货币。 | 8  字节  |
| autonumber     | autonumber  字段自动为每条记录分配数字，通常从 1 开始。      | 4  字节  |
| date/time      | 用于日期和时间                                               | 8  字节  |
| yes/no         | 逻辑字段，可以显示为 yes/no、true/false 或 on/off。在代码中，使用常量 true 和 false （等价于 1 和 0）。注释：yes/no 字段中不允许 null 值 | 1  比特  |
| ole  object    | 可以存储图片、音频、视频或其他 blobs（binary large objects）。 | 最多 1gb |
| hyperlink      | 包含指向其他文件的链接，包括网页。                           |          |
| lookup  wizard | 允许您创建一个可从下拉列表中进行选择的选项列表。             | 4  字节  |

### **4、mysql**

在 mysql 中，有三种主要的类型：text（文本）、number（数字）和 date/time（日期/时间）类型。

##### 1、text：

| 数据类型         | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| char(size)       | 保存固定长度的字符串（可包含字母、数字以及特殊字符）。在括号中指定字符串的长度。最多 255 个字符。 |
| varchar(size)    | 保存可变长度的字符串（可包含字母、数字以及特殊字符）。在括号中指定字符串的最大长度。最多 255 个字符。注释：如果值的长度大于 255，则被转换为 text 类型。 |
| tinytext         | 存放最大长度为 255 个字符的字符串。                          |
| text             | 存放最大长度为 65,535 个字符的字符串。                       |
| blob             | 用于 blobs（binary large objects）。存放最多 65,535 字节的数据。 |
| mediumtext       | 存放最大长度为 16,777,215 个字符的字符串。                   |
| mediumblob       | 用于 blobs（binary large objects）。存放最多 16,777,215 字节的数据。 |
| longtext         | 存放最大长度为 4,294,967,295 个字符的字符串。                |
| longblob         | 用于 blobs (binary large objects)。存放最多 4,294,967,295 字节的数据。 |
| enum(x,y,z,etc.) | 允许您输入可能值的列表。可以在 enum 列表中列出最大 65535 个值。如果列表中不存在插入的值，则插入空值。  注释：这些值是按照您输入的顺序排序的。  可以按照此格式输入可能的值： enum('x','y','z') |
| set              | 与 enum 类似，不同的是，set 最多只能包含 64 个列表项且 set 可存储一个以上的选择。 |

##### 2、number：

| 数据类型        | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| tinyint(size)   | 带符号-128到127 ，无符号0到255。                             |
| smallint(size)  | 带符号范围-32768到32767，无符号0到65535, size 默认为 6。     |
| mediumint(size) | 带符号范围-8388608到8388607，无符号的范围是0到16777215。 size 默认为9 |
| int(size)       | 带符号范围-2147483648到2147483647，无符号的范围是0到4294967295。 size 默认为 11 |
| bigint(size)    | 带符号的范围是-9223372036854775808到9223372036854775807，无符号的范围是0到18446744073709551615。size 默认为 20 |
| float(size,d)   | 带有浮动小数点的小数字。在 size 参数中规定显示最大位数。在 d 参数中规定小数点右侧的最大位数。 |
| double(size,d)  | 带有浮动小数点的大数字。在 size 参数中规显示定最大位数。在 d 参数中规定小数点右侧的最大位数。 |
| decimal(size,d) | 作为字符串存储的 double 类型，允许固定的小数点。在 size 参数中规定显示最大位数。在 d 参数中规定小数点右侧的最大位数。 |

注意：以上的 size 代表的并不是存储在数据库中的具体的长度，如 int(4) 并不是只能存储4个长度的数字。

实际上int(size)所占多少存储空间并无任何关系。int(3)、int(4)、int(8) 在磁盘上都是占用 4 btyes 的存储空间。就是在显示给用户的方式有点不同外，int(m) 跟 int 数据类型是相同的。

例如：

1、int的值为10 （指定zerofill）

int（9）显示结果为000000010int（3）显示结果为010

就是显示的长度不一样而已 都是占用四个字节的空间

##### 3、date：

| 数据类型    | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| date()      | 日期。格式：yyyy-mm-dd  注释：支持的范围是从 '1000-01-01' 到 '9999-12-31' |
| datetime()  | *日期和时间的组合。格式：yyyy-mm-dd hh:mm:ss  注释：支持的范围是从 '1000-01-01 00:00:00' 到 '9999-12-31  23:59:59' |
| timestamp() | *时间戳。timestamp 值使用 unix 纪元('1970-01-01  00:00:00' utc) 至今的秒数来存储。格式：yyyy-mm-dd hh:mm:ss  注释：支持的范围是从 '1970-01-01 00:00:01' utc 到 '2038-01-09  03:14:07' utc |
| time()      | 时间。格式：hh:mm:ss  注释：支持的范围是从 '-838:59:59' 到 '838:59:59' |
| year()      | 2  位或 4 位格式的年。  注释：4 位格式所允许的值：1901 到 2155。2 位格式所允许的值：70 到 69，表示从 1970 到 2069。 |

*即便 datetime 和 timestamp 返回相同的格式，它们的工作方式很不同。在 insert 或 update 查询中，timestamp 自动把自身设置为当前的日期和时间。timestamp 也接受不同的格式，比如 yyyymmddhhmmss、yymmddhhmmss、yyyymmdd 或 yymmdd。

### 5、sql server

#### 1、string：

| 数据类型       | 描述                                                 | 存储                       |
| -------------- | ---------------------------------------------------- | -------------------------- |
| char(n)        | 固定长度的字符串。最多 8,000 个字符。                | defined  width             |
| varchar(n)     | 可变长度的字符串。最多 8,000 个字符。                | 2  bytes + number of chars |
| varchar(max)   | 可变长度的字符串。最多 1,073,741,824 个字符。        | 2  bytes + number of chars |
| text           | 可变长度的字符串。最多 2gb 文本数据。                | 4  bytes + number of chars |
| nchar          | 固定长度的 unicode 字符串。最多 4,000 个字符。       | defined  width x 2         |
| nvarchar       | 可变长度的 unicode 字符串。最多 4,000 个字符。       |                            |
| nvarchar(max)  | 可变长度的 unicode 字符串。最多 536,870,912 个字符。 |                            |
| ntext          | 可变长度的 unicode 字符串。最多 2gb 文本数据。       |                            |
| bit            | 允许 0、1 或 null                                    |                            |
| binary(n)      | 固定长度的二进制字符串。最多 8,000 字节。            |                            |
| varbinary      | 可变长度的二进制字符串。最多 8,000 字节。            |                            |
| varbinary(max) | 可变长度的二进制字符串。最多 2gb。                   |                            |
| image          | 可变长度的二进制字符串。最多 2gb。                   |                            |

#### 2、number：

| 数据类型     | 描述                                                         | 存储         |
| ------------ | ------------------------------------------------------------ | ------------ |
| tinyint      | 允许从 0 到 255 的所有数字。                                 | 1  字节      |
| smallint     | 允许介于 -32,768 与 32,767 的所有数字。                      | 2  字节      |
| int          | 允许介于 -2,147,483,648 与 2,147,483,647 的所有数字。        | 4  字节      |
| bigint       | 允许介于 -9,223,372,036,854,775,808 与  9,223,372,036,854,775,807 之间的所有数字。 | 8  字节      |
| decimal(p,s) | 固定精度和比例的数字。  允许从 -10^38 +1 到 10^38 -1 之间的数字。  p  参数指示可以存储的最大位数（小数点左侧和右侧）。p 必须是 1 到 38 之间的值。默认是 18。  s  参数指示小数点右侧存储的最大位数。s 必须是 0 到 p 之间的值。默认是 0。 | 5-17  字节   |
| numeric(p,s) | 固定精度和比例的数字。  允许从 -10^38 +1 到 10^38 -1 之间的数字。  p  参数指示可以存储的最大位数（小数点左侧和右侧）。p 必须是 1 到 38 之间的值。默认是 18。  s  参数指示小数点右侧存储的最大位数。s 必须是 0 到 p 之间的值。默认是 0。 | 5-17  字节   |
| smallmoney   | 介于 -214,748.3648 与 214,748.3647 之间的货币数据。          | 4  字节      |
| money        | 介于 -922,337,203,685,477.5808 与  922,337,203,685,477.5807 之间的货币数据。 | 8  字节      |
| float(n)     | 从 -1.79e + 308 到 1.79e + 308 的浮动精度数字数据。  n  参数指示该字段保存 4 字节还是 8 字节。float(24) 保存 4 字节，而 float(53) 保存 8 字节。n 的默认值是 53。 | 4  或 8 字节 |
| real         | 从 -3.40e + 38 到 3.40e + 38 的浮动精度数字数据。            | 4  字节      |

#### 3、date：

| 数据类型       | 描述                                                         | 存储       |
| -------------- | ------------------------------------------------------------ | ---------- |
| datetime       | 从 1753 年 1 月 1 日 到 9999 年 12 月 31 日，精度为 3.33 毫秒。 | 8  字节    |
| datetime2      | 从 1753 年 1 月 1 日 到 9999 年 12 月 31 日，精度为 100 纳秒。 | 6-8  字节  |
| smalldatetime  | 从 1900 年 1 月 1 日 到 2079 年 6 月 6 日，精度为 1 分钟。   | 4  字节    |
| date           | 仅存储日期。从 0001 年 1 月 1 日 到 9999 年 12 月 31 日。    | 3  bytes   |
| time           | 仅存储时间。精度为 100 纳秒。                                | 3-5  字节  |
| datetimeoffset | 与 datetime2 相同，外加时区偏移。                            | 8-10  字节 |
| timestamp      | 存储唯一的数字，每当创建或修改某行时，该数字会更新。timestamp 值基于内部时钟，不对应真实时间。每个表只能有一个 timestamp 变量。 |            |

#### 4、其他数据类型：

| 数据类型         | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| sql_variant      | 存储最多 8,000 字节不同数据类型的数据，除了 text、ntext 以及 timestamp。 |
| uniqueidentifier | 存储全局唯一标识符 (guid)。                                  |
| xml              | 存储 xml 格式化数据。最多 2gb。                              |
| cursor           | 存储对用于数据库操作的指针的引用。                           |
| table            | 存储结果集，供稍后处理。                                     |