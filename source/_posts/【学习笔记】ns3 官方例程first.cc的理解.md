---
title: 【学习笔记】ns3 官方例程first.cc的理解
date: '2023-10-19 06:52:45'
description: 从 ns-3 官方 first.cc 例程入门，理解节点、点对点链路、协议栈与 IPv4 地址配置，并观察 UDP 客户端和服务器的通信过程。
draft: 
categories:
  - 学习笔记
  - 研究生
tags:
  - ns-3
  - 网络模拟器
  - 计算机网络
---
**[官方文档](https://www.nsnam.org/docs)**
``` cpp
#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/applications-module.h"

using namespace ns3; //使用 ns3 的命名空间

NS_LOG_COMPONENT_DEFINE ("FirstScriptExample"); //定义一个名为FirstScriptExample的日志组件

int
main (int argc, char *argv[])
{
  CommandLine cmd;
  cmd.Parse (argc, argv); //接受 shell 参数
  
  Time::SetResolution (Time::NS); //更改全局的 Time 对象时间分辨率为纳秒，所有时间都将转换为 ns
  LogComponentEnable ("UdpEchoClientApplication", LOG_LEVEL_INFO);
  LogComponentEnable ("UdpEchoServerApplication", LOG_LEVEL_INFO); //日志组件记录 Udp 的服务器和客户端，记录等级为 INFO

  NodeContainer nodes; //创建一个Node容器nodes
  nodes.Create (2); //nodes容器创建两个Node

  PointToPointHelper pointToPoint; //创建一个PtP NetDevice的 Helper 
  pointToPoint.SetDeviceAttribute ("DataRate", StringValue ("5Mbps"));
  pointToPoint.SetChannelAttribute ("Delay", StringValue ("2ms")); //将该 PtP 网络设备的速率设置为5Mbps，信道时延为 2ms

  NetDeviceContainer devices; //创建一个 NetDevice 容器
  devices = pointToPoint.Install (nodes); //将 PtP NetDevice 安装到 nodes 中，并将这组 PtP 的网络设备赋值给 devices

  InternetStackHelper stack; //定义一个 internet 协议栈
  stack.Install (nodes); //将该协议栈安装到 nodes 容器中的所有 node (的 NetDevice??)上

  Ipv4AddressHelper address; //定义一个 ipv4 的 Helper，方便快速分配ipv4 address
  address.SetBase ("10.1.1.0", "255.255.255.0"); //ipv4 网段为 10.1.1.0，子网掩码为 255.2555.255.0

  Ipv4InterfaceContainer interfaces = address.Assign (devices); //为 NetDevice 分配 ip 地址并赋值给 interfaces

  UdpEchoServerHelper echoServer (9); //设置 udp 服务器的端口为 9

  ApplicationContainer serverApps = echoServer.Install (nodes.Get (1)); //在 node1 上安装 udp 服务器应用程序
  serverApps.Start (Seconds (1.0)); //udp 服务器在 1s 时打开
  serverApps.Stop (Seconds (10.0)); //在 10s 时关闭

  UdpEchoClientHelper echoClient (interfaces.GetAddress (1), 9); //udp 客户端访问 node1 的 ip，端口为 9
  echoClient.SetAttribute ("MaxPackets", UintegerValue (1)); //运行传输的最大包数为 1
  echoClient.SetAttribute ("Interval", TimeValue (Seconds (1.0))); // 间隔 1s
  echoClient.SetAttribute ("PacketSize", UintegerValue (1024)); //每个包 1024 字节

  ApplicationContainer clientApps = echoClient.Install (nodes.Get (0)); //在 node0 上安装 udp 客户端应用程序
  clientApps.Start (Seconds (2.0)); //udp 客户端在 2s 时打开
  clientApps.Stop (Seconds (10.0)); //在 10s 时关闭

//以下是固定模式
  Simulator::Run (); //模拟器开始运行
  Simulator::Destroy (); //摧毁模拟器
  return 0;
}
```
运行结果：
![](https://image.txgde.space/2023/10/27/653b7d8073731.webp)
udp 客户端在2s 启动时向 udp 服务器发送了一个 1024 字节的数据包

尝试更改：
``` cpp
echoClient.SetAttribute ("MaxPackets", UintegerValue (5)); //运行传输的最大包数为 5
echoClient.SetAttribute ("Interval", TimeValue (Seconds (1.0))); // 间隔 1s
echoClient.SetAttribute ("PacketSize", UintegerValue (1024)); //每个包 1024 字节

```
 运行结果：
![](https://image.txgde.space/2023/10/27/653b7e53f295e.webp)
 udp 客户端在2s 启动时开始向 udp 服务器发送 1024 字节的数据包，每隔 1s 发送一个