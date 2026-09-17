
---

# 5. `multiplayer-poker.md`

```markdown
# Multiplayer Poker | Real-Time Texas Hold'em

## Overview

Multiplayer poker requires real-time synchronization between multiple clients
and a centralized game server.

The Texas-Holdem-Poker-Source-Code project is designed for multiplayer
Texas Hold'em game scenarios.

## Multiplayer Architecture

```text
Player A ──┐
Player B ──┤
Player C ──┼──> Game Server
Player D ──┘        │
                    ▼
                Game State
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
     Player A    Player B    Player C