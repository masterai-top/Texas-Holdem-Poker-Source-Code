# 德州撲克源碼 / 德州源碼 / Texas Holdem Poker Source Code

[简体中文](README.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md)

面向多人即時對戰的德州撲克完整解決方案。專案包含 C++ 遊戲伺服器、Unity / Cocos Creator 用戶端程式碼、MySQL 與 Redis 資料層，以及撲克大廳、私人桌、俱樂部、聯盟、好友局、SNG 和 MTT 錦標賽等業務模組。

> 本儲存庫用於軟體開發、技術評估與合法娛樂專案。部署或營運前，請遵守所在地關於網路遊戲、資料保護、支付及年齡限制的法規。

## 專案概覽

這套德州撲克源碼涵蓋用戶端互動、即時通訊、牌桌邏輯與營運後台的主要流程，適合二次開發、架構研究及私有化部署。

| 層級 | 主要內容 |
| --- | --- |
| 用戶端 | Unity / Cocos Creator、Android SDK、大廳、俱樂部與牌桌介面 |
| 遊戲服務 | C++、即時牌桌邏輯、房間狀態與賽事流程 |
| 通訊 | Tars、Protocol Buffers 與專案私有協議 |
| 資料 | MySQL、Redis、玩家資料、戰績與排行榜 |
| 玩法 | 標準德州、奧馬哈、短牌、大菠蘿、AOF、SNG、MTT |
| 營運 | 玩家管理、俱樂部、聯盟、報表、風險控制與局分管理 |

## 核心功能

- 多人即時德州撲克對局與線上房間管理
- 好友局、私人桌、俱樂部與聯盟系統
- 標準德州、奧馬哈、短牌、大菠蘿與 AOF
- SNG 坐滿即玩及 MTT 多桌錦標賽流程
- Buy-in、Straddle、保險、戰績與排行榜
- 玩家管理、報表統計與營運後台
- Android 用戶端接入及多語系擴充基礎

## 俱樂部、聯盟與私人局玩法

- **建立與加入俱樂部**：玩家可以建立俱樂部、申請加入，管理者可維護成員及權限。
- **俱樂部牌局**：支援俱樂部內開桌、好友約局與私人桌。
- **聯盟系統**：多個俱樂部可加入聯盟，共同組織牌局及聯盟賽事。
- **俱樂部幣與局分**：包含俱樂部幣顯示、局分管理及後台調整流程。
- **牌桌擴充**：支援自動 Buy-in、Straddle、保險等牌桌設定。
- **戰績與統計**：保存牌局記錄、玩家戰績、排行榜及營運報表。
- **賽事玩法**：支援 SNG 坐滿即玩及 MTT 多桌錦標賽流程。

玩法矩陣包括標準德州、奧馬哈、短牌、大菠蘿、AOF、SNG 及 MTT。最終可用範圍以目前程式碼分支、資料庫設定及部署版本為準。

## 產品截圖與功能介紹

### MTT 賽事

[![德州撲克源碼 MTT 多桌錦標賽介面](Screenshots/MTT赛事.jpg)](Screenshots/MTT赛事.jpg)

### 個人中心與俱樂部幣

| 個人中心 | 俱樂部幣 |
| --- | --- |
| [![德州撲克個人中心](Screenshots/个人中心.jpg)](Screenshots/个人中心.jpg) | [![德州撲克俱樂部幣](Screenshots/俱乐部币.jpg)](Screenshots/俱乐部币.jpg) |

### 建立俱樂部與加入聯盟

| 建立俱樂部 | 加入聯盟 |
| --- | --- |
| [![建立德州撲克俱樂部](Screenshots/创建俱乐部.jpg)](Screenshots/创建俱乐部.jpg) | [![德州撲克俱樂部加入聯盟](Screenshots/加入联盟.jpg)](Screenshots/加入联盟.jpg) |

### 好友局與即時牌桌

| 好友局 | 打牌房間 |
| --- | --- |
| [![德州撲克好友私人局](Screenshots/好友局.jpg)](Screenshots/好友局.jpg) | [![德州撲克即時打牌房間](Screenshots/打牌房间.jpg)](Screenshots/打牌房间.jpg) |

上述截圖均引用儲存庫 `Screenshots/` 目錄中的現有檔案，展示 MTT、個人中心、俱樂部幣、俱樂部與聯盟、好友局及即時牌桌。實際功能以目前程式碼及部署設定為準。

## 技術架構

```text
Unity / Cocos Creator / Android
              |
      Tars / Protobuf / TCP
              |
       C++ Game Services
        /             \
     MySQL           Redis
```

模組邊界、目錄對應及評估步驟請參閱 [技術架構說明](docs/ARCHITECTURE.md)。

## 儲存庫內容

- `Android SDK/client/`：Android 用戶端相關內容
- `Assets/`、`Screenshots/`：介面資源與功能截圖
- `core/`：核心模組
- `docs/`：專案與架構文件
- `*.cpp`、`*.h`：C++ 伺服器實作
- `*.proto.bytes`、`*.tars`：訊息與服務介面定義
- `*.ts`：用戶端 TypeScript 程式碼

## 使用與評估

1. 先閱讀 [技術架構說明](docs/ARCHITECTURE.md)，確認伺服器、用戶端與資料元件。
2. 檢查專案設定、資料庫腳本及外部相依套件是否適合目標環境。
3. 在隔離的開發環境中編譯及驗證個別服務，再進行整合測試。
4. 上線前完成安全審查、壓力測試、日誌去識別化與合規檢查。

不同分支或交付版本的相依套件可能不同，請以儲存庫內實際建置檔案及部署文件為準。

## 適用情境

- 德州撲克源碼技術評估與架構學習
- 德州源碼繁體中文搜尋與開發參考
- C++ 多人遊戲伺服器研究
- Unity / Cocos Creator 撲克用戶端二次開發
- 俱樂部、私人桌、SNG 與 MTT 賽事系統原型

## 相關文件

- [简体中文说明](README.md)
- [English documentation](README.en.md)
- [技術架構說明](docs/ARCHITECTURE.md)

## 聯絡方式

- Telegram: `@xuzongbin001`
- Email: `masterai918@gmail.com`

## 授權

請查看 [LICENSE](LICENSE)。使用程式碼、圖片、音效或其他資源前，請確認相應授權範圍。
