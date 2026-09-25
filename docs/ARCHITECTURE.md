# 德州扑克源码技术架构 / 德州撲克源碼技術架構

本文帮助开发者快速理解仓库中客户端、通信、C++ 服务端和数据层的关系。具体构建参数与部署方式应以仓库中的实际配置为准。

## 系统边界

```text
Client UI
  Unity / Cocos Creator / Android
        |
        | Tars / Protobuf / TCP
        v
Gateway and game services
  Login / Hall / Router / Room / Order / Push
        |
        +---- MySQL: durable business data
        +---- Redis: cache and online state
```

## 代码与协议

- C++ 源文件（`*.cpp`、`*.h`）实现服务进程、路由、订单、推送和牌桌相关逻辑。
- Tars 文件（`*.tars`）描述服务接口。
- Protocol Buffers 资源（`*.proto.bytes`）用于客户端与服务端消息定义。
- TypeScript 文件（`*.ts`）承载部分客户端事件、消息处理和应用逻辑。
- `Android SDK/client/`、`Assets/` 与 `Screenshots/` 提供客户端接入和界面参考。

## 业务模块

仓库所示模块包括登录、大厅、好友、俱乐部、房间动态、战绩、排行榜、订单、签到和推送。玩法与赛事覆盖标准德州、奥马哈、短牌、大菠萝、AOF、SNG 和 MTT；最终可用范围取决于具体分支、配置与数据库数据。

## 部署前检查

1. 识别所有外部依赖、版本和许可证。
2. 为 MySQL 与 Redis 使用独立的非生产测试实例。
3. 检查密钥、数据库口令、日志和示例配置，避免提交真实凭据。
4. 分别验证登录、大厅、房间、牌桌、订单和推送链路。
5. 对实时通信、断线重连、并发房间和赛事结算进行压力测试。
6. 上线前完成安全、隐私、支付和当地游戏法规审查。

## 搜索词与项目定位

本项目可用于检索和研究以下技术方向：德州扑克源码、德州源码、德州撲克源碼、德州源碼、Texas Holdem Poker Source Code、C++ poker server、Unity poker client、poker club system、SNG 和 MTT tournament server。

这些术语用于准确描述项目内容，不代表搜索排名或商业效果保证。
