# 德州扑克源码 / 德州撲克源碼 / Texas Holdem Poker Source Code

[简体中文](README.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md)

面向多人实时对战的德州扑克完整解决方案。项目包含 C++ 游戏服务端、Unity / Cocos Creator 客户端代码、MySQL 与 Redis 数据层，以及扑克大厅、私人桌、俱乐部、联盟、好友局、SNG 和 MTT 锦标赛等业务模块。

专题页面：[德州扑克源码](https://masterai-top.github.io/Texas-Holdem-Poker-Source-Code/zh-cn/texas-holdem-source-code.html) · [德州俱乐部源码](https://masterai-top.github.io/Texas-Holdem-Poker-Source-Code/zh-cn/poker-club-source-code.html) · [德州私人局源码](https://masterai-top.github.io/Texas-Holdem-Poker-Source-Code/zh-cn/private-poker-game-source-code.html)

> 本仓库用于软件开发、技术评估与合法娱乐项目。部署或运营前，请遵守所在国家或地区关于网络游戏、数据保护、支付和年龄限制的法律法规。

## 项目概览

这套德州源码覆盖从客户端交互、实时通信、牌桌逻辑到运营后台的主要链路，适合进行二次开发、架构研究和私有化部署。

| 层级 | 主要内容 |
| --- | --- |
| 客户端 | Unity / Cocos Creator、Android SDK、大厅、俱乐部与牌桌界面 |
| 游戏服务 | C++、实时牌桌逻辑、房间状态与赛事流程 |
| 通信 | Tars、Protocol Buffers 与项目私有协议 |
| 数据 | MySQL、Redis、玩家资料、战绩与排行榜 |
| 玩法 | 标准德州、奥马哈、短牌、大菠萝、AOF、SNG、MTT |
| 运营 | 玩家管理、俱乐部、联盟、报表、风险控制与局分管理 |

## 核心功能

- 多人实时德州扑克对局与在线房间管理
- 好友局、私人桌、俱乐部和联盟体系
- 标准德州、奥马哈、短牌、大菠萝与 AOF
- SNG 坐满即玩与 MTT 多桌锦标赛流程
- Buy-in、Straddle、保险、战绩和排行榜
- 玩家管理、报表统计和运营后台
- Android 客户端接入与多语言扩展基础

## 俱乐部、联盟与私人局玩法

俱乐部体系不是单一入口，而是贯穿建房、成员、牌局和战绩的完整业务流程：

- **创建与加入俱乐部**：玩家可以创建俱乐部、申请加入俱乐部，并由管理者维护成员与权限。
- **俱乐部牌局**：支持俱乐部内部开桌、好友约局和私人桌，适合固定玩家组织牌局。
- **联盟体系**：多个俱乐部可以加入联盟，统一组织牌局和联盟赛事。
- **俱乐部币与局分**：包含俱乐部币展示、局分管理及后台调整流程。
- **牌桌扩展**：支持自动 Buy-in、Straddle、保险等牌桌配置。
- **战绩与统计**：保存牌局记录、玩家战绩、排行榜和运营报表。
- **赛事玩法**：支持 SNG 坐满即玩以及 MTT 多桌锦标赛流程。

玩法矩阵包括标准德州、奥马哈、短牌、大菠萝、AOF、SNG 和 MTT。最终可用玩法以当前代码分支、数据库配置及部署版本为准。

## 技术架构

```text
Unity / Cocos Creator / Android
              |
      Tars / Protobuf / TCP
              |
       C++ Game Services
        /             \
     MySQL           Redis
```

更详细的模块边界、目录映射和评估步骤见 [技术架构说明](docs/ARCHITECTURE.md)。

## 仓库内容

- `Android SDK/client/`：Android 客户端相关内容
- `Assets/`、`Screenshots/`：界面资源与功能截图
- `core/`：核心模块
- `docs/`：项目与架构文档
- `*.cpp`、`*.h`：C++ 服务端实现
- `*.proto.bytes`、`*.tars`：消息与服务接口定义
- `*.ts`：客户端 TypeScript 代码

## 产品截图与功能介绍

### MTT 赛事

[![德州扑克源码 MTT 多桌锦标赛界面](Screenshots/MTT赛事.jpg)](Screenshots/MTT赛事.jpg)

展示 MTT 多桌锦标赛入口和赛事信息，用于组织多人淘汰制锦标赛。

### 个人中心与俱乐部币

| 个人中心 | 俱乐部币 |
| --- | --- |
| [![德州扑克个人中心](Screenshots/个人中心.jpg)](Screenshots/个人中心.jpg) | [![德州扑克俱乐部币](Screenshots/俱乐部币.jpg)](Screenshots/俱乐部币.jpg) |

个人中心集中展示玩家资料与账户信息；俱乐部币用于俱乐部内部的业务展示和管理流程。

### 创建俱乐部与加入联盟

| 创建俱乐部 | 加入联盟 |
| --- | --- |
| [![创建德州扑克俱乐部](Screenshots/创建俱乐部.jpg)](Screenshots/创建俱乐部.jpg) | [![德州扑克俱乐部加入联盟](Screenshots/加入联盟.jpg)](Screenshots/加入联盟.jpg) |

俱乐部管理者可以创建俱乐部、维护成员，并加入联盟组织跨俱乐部牌局和赛事。

### 好友局与实时牌桌

| 好友局 | 打牌房间 |
| --- | --- |
| [![德州扑克好友私人局](Screenshots/好友局.jpg)](Screenshots/好友局.jpg) | [![德州扑克实时打牌房间](Screenshots/打牌房间.jpg)](Screenshots/打牌房间.jpg) |

好友局用于邀请固定玩家进入私人房间；实时牌桌承担下注、跟注、加注、弃牌、保险和结算等对局流程。

以上截图均引用仓库 `Screenshots/` 目录中的现有文件，用于展示已经能够确认的产品界面。实际功能以当前代码和部署配置为准。

## 使用与评估

1. 先阅读 [技术架构说明](docs/ARCHITECTURE.md)，确认服务端、客户端和数据组件。
2. 检查项目配置、数据库脚本及外部依赖是否适合目标环境。
3. 在隔离的开发环境中编译并验证单个服务，再进行联调。
4. 上线前完成安全审计、压力测试、日志脱敏和合规检查。

不同分支或交付版本的依赖可能不同，请以仓库内实际构建文件和部署文档为准。

## 适用场景

- 德州扑克源码技术评估与架构学习
- 德州撲克源碼繁体中文项目检索与开发参考
- C++ 多人游戏服务器研究
- Unity / Cocos Creator 扑克客户端二次开发
- 俱乐部、私人桌、SNG 与 MTT 赛事系统原型

## 相关文档

- [繁體中文說明](README.zh-TW.md)
- [English documentation](README.en.md)
- [技术架构说明](docs/ARCHITECTURE.md)

## 联系

- Telegram: `@xuzongbin001`
- Email: `masterai918@gmail.com`

## License

请查看 [LICENSE](LICENSE)。使用代码、图片、音效或其他资源前，请确认相应授权范围。
