# Texas Holdem Poker Source Code

[简体中文](README.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md)

A multiplayer Texas Holdem poker solution with a C++ game server, Unity / Cocos Creator client code, MySQL and Redis data services, poker clubs, private tables, friend rooms, SNG games, and MTT tournaments.

> This repository is intended for software development, technical evaluation, and lawful entertainment projects. Before deployment, comply with applicable gaming, privacy, payment, and age-restriction laws.

## Project overview

The codebase covers the main path from client interaction and real-time communication to table logic and operations management.

| Layer | Components |
| --- | --- |
| Client | Unity / Cocos Creator, Android SDK, lobby, club, and table UI |
| Game services | C++, real-time table logic, rooms, and tournament flows |
| Protocols | Tars, Protocol Buffers, and project-specific protocols |
| Data | MySQL, Redis, player profiles, records, and rankings |
| Game modes | Holdem, Omaha, Short Deck, Pineapple, AOF, SNG, and MTT |
| Operations | Player management, clubs, leagues, reporting, and risk controls |

## Features

- Real-time multiplayer poker rooms
- Friend games, private tables, clubs, and leagues
- Texas Holdem, Omaha, Short Deck, Pineapple, and AOF
- Sit-and-go and multi-table tournament flows
- Buy-in, Straddle, insurance, hand records, and rankings
- Operations dashboard and reporting modules
- Android integration and a foundation for localization

## Club, league, and private-table gameplay

- Create and join poker clubs with member and permission management.
- Open club tables, friend games, and invitation-based private rooms.
- Connect multiple clubs through a league and organize league games.
- Manage club currency, table points, records, rankings, and reports.
- Configure Buy-in, Straddle, insurance, and other table options.
- Run SNG games and MTT multi-table tournament flows.

The gameplay matrix includes Holdem, Omaha, Short Deck, Pineapple, AOF, SNG, and MTT. Availability depends on the selected branch, database configuration, and deployment version.

## Product screenshots

### MTT tournament

[![Texas Holdem MTT tournament interface](Screenshots/MTT赛事.jpg)](Screenshots/MTT赛事.jpg)

### Player center and club currency

| Player center | Club currency |
| --- | --- |
| [![Poker player center](Screenshots/个人中心.jpg)](Screenshots/个人中心.jpg) | [![Poker club currency](Screenshots/俱乐部币.jpg)](Screenshots/俱乐部币.jpg) |

### Create a club and join a league

| Create club | Join league |
| --- | --- |
| [![Create a poker club](Screenshots/创建俱乐部.jpg)](Screenshots/创建俱乐部.jpg) | [![Join a poker league](Screenshots/加入联盟.jpg)](Screenshots/加入联盟.jpg) |

### Friend game and real-time table

| Friend game | Gameplay room |
| --- | --- |
| [![Private poker friend game](Screenshots/好友局.jpg)](Screenshots/好友局.jpg) | [![Real-time poker room](Screenshots/打牌房间.jpg)](Screenshots/打牌房间.jpg) |

### Client and operations dashboard

| Client UI 1 | Client UI 2 |
| --- | --- |
| ![Texas Holdem client UI 1](https://private-user-images.githubusercontent.com/90965583/578352167-8f1900e2-93c7-4af1-9228-968feddba9ab.png) | ![Texas Holdem client UI 2](https://private-user-images.githubusercontent.com/90965583/578352189-0519cbf7-8856-4488-8838-374dc8019f5e.png) |
| ![Texas Holdem client UI 3](https://private-user-images.githubusercontent.com/90965583/578352191-57e9984e-36c3-4d91-abe7-09b1420de6af.png) | ![Texas Holdem client UI 4](https://private-user-images.githubusercontent.com/90965583/578352199-7dc4fb13-7624-40af-8bc0-80d5ae2a750d.png) |

| Operations dashboard 1 | Operations dashboard 2 |
| --- | --- |
| ![Poker operations dashboard 1](https://private-user-images.githubusercontent.com/90965583/578352682-862255c7-e740-479d-8ead-ec8373d46c19.png) | ![Poker operations dashboard 2](https://private-user-images.githubusercontent.com/90965583/578352694-9503e359-06f4-424f-8fa0-8caa149e74a9.png) |

These screenshots cover the tournament, player, club, league, friend-room, live-table, and operations workflows. Actual behavior depends on the current code and deployment configuration.

## Architecture

```text
Unity / Cocos Creator / Android
              |
      Tars / Protobuf / TCP
              |
       C++ Game Services
        /             \
     MySQL           Redis
```

See [Architecture](docs/ARCHITECTURE.md) for module boundaries, repository mapping, and an evaluation checklist.

## Repository map

- `Android SDK/client/`: Android client components
- `Assets/`, `Screenshots/`: UI assets and product screenshots
- `core/`: core modules
- `docs/`: project documentation
- `*.cpp`, `*.h`: C++ server implementation
- `*.proto.bytes`, `*.tars`: message and service definitions
- `*.ts`: client-side TypeScript code

## Evaluation workflow

1. Review the architecture and identify client, server, and data components.
2. Validate build files, database scripts, and external dependencies for your environment.
3. Build and test individual services in an isolated development environment.
4. Complete security review, load testing, log redaction, and compliance checks before production use.

Dependencies may vary across branches and delivery versions. Treat the build and deployment files in the repository as the source of truth.

## Contact

- Telegram: `@xuzongbin001`
- Email: `masterai918@gmail.com`

## License

See [LICENSE](LICENSE). Confirm the applicable license before using code, artwork, audio, or other assets.
