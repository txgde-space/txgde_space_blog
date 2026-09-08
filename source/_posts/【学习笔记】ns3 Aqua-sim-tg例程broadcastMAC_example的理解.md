---
title: 【学习笔记】ns3 Aqua-sim-tg例程broadcastMAC_example的理解
date: '2023-10-23 03:05:49'
description: 解读 Aqua-sim-tg 的 broadcastMAC_example：水下节点与 Sink 的创建、信道和 MAC 配置，以及数据包广播与仿真流程。
draft: 
categories:
  - 学习笔记
  - 研究生
tags:
  - 吉林大学
  - 计算机网络
  - Aquasim
  - ns-3
---
``` cpp
#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/mobility-module.h"
#include "ns3/aqua-sim-tg-module.h"
#include "ns3/applications-module.h"
#include "ns3/log.h"
#include "ns3/callback.h"


/*
 * BroadCastMAC
 *
 * String topology:
 * N ---->  N  -----> N -----> N* -----> S
 *
 */

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("ASBroadcastMac");

int
main (int argc, char *argv[])
{
  double simStop = 2; //seconds
  int nodes = 3;
  int sinks = 1;
  uint32_t m_dataRate = 128;
  uint32_t m_packetSize = 40;
  //double range = 20;

  LogComponentEnable ("ASBroadcastMac", LOG_LEVEL_INFO);//日志

  //to change on the fly
  //shell 参数
  CommandLine cmd;
  cmd.AddValue ("simStop", "Length of simulation", simStop);
  cmd.AddValue ("nodes", "Amount of regular underwater nodes", nodes);
  cmd.AddValue ("sinks", "Amount of underwater sinks", sinks);
  cmd.Parse(argc,argv);

  std::cout << "-----------Initializing simulation-----------\n";

  NodeContainer nodesCon;//普通节点容器
  NodeContainer sinksCon;//水下节点容器
  NS_LOG_DEBUG("创建普通节点容器");
  nodesCon.Create(nodes);//创建
  NS_LOG_DEBUG("创建水下节点容器");
  sinksCon.Create(sinks);

  PacketSocketHelper socketHelper;//Packet套接字？？(链路层)
  socketHelper.Install(nodesCon); //安装到节点上
  socketHelper.Install(sinksCon);

  //establish layers using helper's pre-build settings
  AquaSimChannelHelper channel = AquaSimChannelHelper::Default();//默认通道配置
  //channel.SetPropagation("ns3::AquaSimRangePropagation");
  AquaSimHelper asHelper = AquaSimHelper::Default(); //配置网络层
  asHelper.SetChannel(channel.Create());//创建通道
  asHelper.SetMac("ns3::AquaSimBroadcastMac");//创建 Mac 地址
  asHelper.SetRouting("ns3::AquaSimStaticRouting");//设置静态路由

  /*
   * Set up mobility model for nodes and sinks
   */
  MobilityHelper mobility; //移动模型
  NetDeviceContainer devices; //网络设备容器
  Ptr<ListPositionAllocator> position = CreateObject<ListPositionAllocator> (); //节点位置信息类指针
  Vector boundry = Vector(0,0,0); //设置一个位置起始向量

  std::cout << "Creating Nodes\n";

  for (NodeContainer::Iterator i = nodesCon.Begin(); i != nodesCon.End(); i++)
    {//对每一个普通节点
      Ptr<AquaSimNetDevice> newDevice = CreateObject<AquaSimNetDevice>();//创建一个新网络设备
      position->Add(boundry);//将当前boundry添加到位置中
      devices.Add(asHelper.Create(*i, newDevice));
      //asHelper.Create(*i, newDevice) 在 i 的节点上创建新的网络设备
      //并将该网络设备添加到设备容器中
      NS_LOG_DEBUG("Node:" << newDevice->GetAddress() << " position(x):" << boundry.x);
      boundry.x += 100;//boundry x 轴坐标+100
      //newDevice->GetPhy()->SetTransRange(range);
    }

  for (NodeContainer::Iterator i = sinksCon.Begin(); i != sinksCon.End(); i++)
    {//水下节点，同以上普通节点
      Ptr<AquaSimNetDevice> newDevice = CreateObject<AquaSimNetDevice>();
      position->Add(boundry);
      devices.Add(asHelper.Create(*i, newDevice));

      NS_LOG_DEBUG("Sink:" << newDevice->GetAddress() << " position(x):" << boundry.x);
      boundry.x += 100;
      //newDevice->GetPhy()->SetTransRange(range);
    }


  mobility.SetPositionAllocator(position);//为移动设备分配位置信息？？
  mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");//移动模型为固定位置移动模型
  mobility.Install(nodesCon);//将位置模型安装到普通和水下节点
  mobility.Install(sinksCon);

  PacketSocketAddress socket; //定义 Packet 套接字地址
  //链路层套接字PacketSocketAddress（协议号+NetDevice标识+MAC地址)
  socket.SetAllDevices();
  socket.SetPhysicalAddress (devices.Get(nodes)->GetAddress()); //Set dest to first sink (nodes+1 device)
  socket.SetProtocol (0);

  OnOffNdHelper app ("ns3::PacketSocketFactory", Address (socket));//设置 OnOff 应用程序用来周期性发送数据
  app.SetAttribute ("OnTime", StringValue ("ns3::ConstantRandomVariable[Constant=1]"));
  app.SetAttribute ("OffTime", StringValue ("ns3::ConstantRandomVariable[Constant=0]"));
  app.SetAttribute ("DataRate", DataRateValue (m_dataRate));
  app.SetAttribute ("PacketSize", UintegerValue (m_packetSize));

  ApplicationContainer apps = app.Install (nodesCon);//app 容器
  apps.Start (Seconds (0.5));
  apps.Stop (Seconds (simStop + 1));


  Ptr<Node> sinkNode = sinksCon.Get(0);//获得 sinkNode
  TypeId psfid = TypeId::LookupByName ("ns3::PacketSocketFactory");//使用Packet套接字，并获取的该类型的 id

  Ptr<Socket> sinkSocket = Socket::CreateSocket (sinkNode, psfid);//创建 sinkNode 的 Socket
  sinkSocket->Bind (socket);//将 sinkNode 的套接字与 Node 的套接字绑定进行通信

/*
 *  For channel trace driven simulation
 */
/*
  AquaSimTraceReader tReader;
  tReader.SetChannel(asHelper.GetChannel());
  if (tReader.ReadFile("channelTrace.txt")) NS_LOG_DEBUG("Trace Reader Success");
  else NS_LOG_DEBUG("Trace Reader Failure");
*/

  Packet::EnablePrinting (); //for debugging purposes
  std::cout << "-----------Running Simulation-----------\n";
  Simulator::Stop(Seconds(simStop));
  Simulator::Run();
  Simulator::Destroy();

  std::cout << "fin.\n";
  return 0;
}
```
设定日志
``` shell
export NS_LOG=PacketSocket=level_all:AquaSimBroadcastMac=level_all:Node=level_all
```
运行命令
``` shell
./waf --run "src/aqua-sim-tg/examples/broadcastMAC_example"
```
运行日志
``` js
-----------Initializing simulation-----------
创建普通节点容器
Node:Node(0x556037450b30) //3 个普通节点编号
Node:Construct(0x556037450b30)
Node:Node(0x55603749aad0)
Node:Construct(0x55603749aad0)
Node:Node(0x556037496b40)
Node:Construct(0x556037496b40)
创建水下节点容器
Node:Node(0x556037496c30) //水下节点编号
Node:Construct(0x556037496c30)
Creating Nodes
Node:AddDevice(0x556037450b30, 0x556037497630) //将设备绑定到节点(节点号，设备号)
Node:GetId(0x556037450b30)
Node:NotifyDeviceAdded(0x556037450b30, 0x556037497630)
Node:02-02-00:01 position(x):0
Node:AddDevice(0x55603749aad0, 0x556037498570)
Node:GetId(0x55603749aad0)
Node:NotifyDeviceAdded(0x55603749aad0, 0x556037498570)
Node:02-02-00:02 position(x):100
Node:AddDevice(0x556037496b40, 0x556037485480)
Node:GetId(0x556037496b40)
Node:NotifyDeviceAdded(0x556037496b40, 0x556037485480)
Node:02-02-00:03 position(x):200
Node:AddDevice(0x556037496c30, 0x5560374868e0)
Node:GetId(0x556037496c30)
Node:NotifyDeviceAdded(0x556037496c30, 0x5560374868e0)
Sink:02-02-00:04 position(x):300
Node:AddApplication(0x556037450b30, 0x556037488590)
Node:GetId(0x556037450b30)
Node:AddApplication(0x55603749aad0, 0x556037488b00)
Node:GetId(0x55603749aad0)
Node:AddApplication(0x556037496b40, 0x556037488fd0)
Node:GetId(0x556037496b40)
PacketSocket:PacketSocket(0x556037489480)
PacketSocket:SetNode(0x556037489480, 0x556037496c30)
PacketSocket:Bind(0x556037489480, 03-0b-00:00:00:00:00:00:00:02:02:00:04)
PacketSocket:DoBind(0x556037489480, 03-0b-00:00:00:00:00:00:00:02:02:00:04)
Node:RegisterProtocolHandler(0x556037496c30, 0x7fffdba158f8, 0, 0, 0)
-----------Running Simulation-----------
Node:DoInitialize(0x556037450b30)
Node:DoInitialize(0x55603749aad0)
Node:DoInitialize(0x556037496b40)
Node:DoInitialize(0x556037496c30)
PacketSocket:PacketSocket(0x5560374897e0)
PacketSocket:SetNode(0x5560374897e0, 0x556037450b30)
PacketSocket:Connect(0x5560374897e0, 03-0b-00:00:00:00:00:00:00:02:02:00:04)
PacketSocket:SetAllowBroadcast(0x5560374897e0, 0)
PacketSocket:GetNode(0x5560374897e0)
Node:GetId(0x556037450b30)
PacketSocket:PacketSocket(0x556037489b60)
PacketSocket:SetNode(0x556037489b60, 0x55603749aad0)
PacketSocket:Connect(0x556037489b60, 03-0b-00:00:00:00:00:00:00:02:02:00:04)
PacketSocket:SetAllowBroadcast(0x556037489b60, 0)
PacketSocket:GetNode(0x556037489b60)
Node:GetId(0x55603749aad0)
PacketSocket:PacketSocket(0x556037489f30)
PacketSocket:SetNode(0x556037489f30, 0x556037496b40)
PacketSocket:Connect(0x556037489f30, 03-0b-00:00:00:00:00:00:00:02:02:00:04)
PacketSocket:SetAllowBroadcast(0x556037489f30, 0)
PacketSocket:GetNode(0x556037489f30)
Node:GetId(0x556037496b40)
PacketSocket:RecvFrom(0x5560374897e0, 4294967295, 0)
PacketSocket:RecvFrom(0x556037489b60, 4294967295, 0)
PacketSocket:RecvFrom(0x556037489f30, 4294967295, 0)
PacketSocket:RecvFrom(0x5560374897e0, 4294967295, 0)
PacketSocket:RecvFrom(0x556037489b60, 4294967295, 0)
PacketSocket:RecvFrom(0x556037489f30, 4294967295, 0)
Node:DoDispose(0x556037450b30)
AquaSimBroadcastMac:DoDispose(0x556037497f10)
PacketSocket:DoDispose(0x5560374897e0)
PacketSocket:~PacketSocket(0x5560374897e0)
Node:DoDispose(0x55603749aad0)
AquaSimBroadcastMac:DoDispose(0x556037484c30)
PacketSocket:DoDispose(0x556037489b60)
PacketSocket:~PacketSocket(0x556037489b60)
Node:DoDispose(0x556037496b40)
AquaSimBroadcastMac:DoDispose(0x5560374860a0)
PacketSocket:DoDispose(0x556037489f30)
PacketSocket:~PacketSocket(0x556037489f30)
Node:DoDispose(0x556037496c30)
AquaSimBroadcastMac:DoDispose(0x556037487650)
fin.
PacketSocket:DoDispose(0x556037489480)
PacketSocket:~PacketSocket(0x556037489480)
Node:~Node(0x556037496c30)
Node:~Node(0x556037450b30)
Node:~Node(0x55603749aad0)
Node:~Node(0x556037496b40)
```
## 仍需理解的部分
### Packet套接字
###  AquaSimHelper
### mobility
### position 是如何分配到节点上的