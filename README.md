# 💰 BalanceBot

A complete Discord economy bot! Earn coins, claim daily rewards, compete on leaderboards, and buy server-specific roles from shops. Each server can manage its own shop, allowing server owners to sell roles to their members.

---

## Features

- 🎉 **Daily Rewards** – Claim daily coins automatically.
- 💬 **Message Coins** – Earn coins for chatting with spam protection.
- 🏦 **Wallet System** – Track your coins and manage your wallet.
- 🛒 **Server Shops** – Server owners can create and manage shops for selling roles.
- 📊 **Leaderboards** – Compete with others and see who has the richest wallet.
- ⚡ **Give Command** – Transfer coins to other members.
- 🌟 **Customizable** – Works globally, while shops are per-server.

---

## Commands

### User Commands
| Command | Description |
|---------|-------------|
| `/wallet [user]` | Check your wallet or someone else's. |
| `/daily` | Claim your daily coins. |
| `/give <user> <amount>` | Give coins to another member. |
| `/leaderboard` | View the top members by wallet. |
| `/buy-role <role>` | Buy a role from the server shop. |
| `/shop-list` | Display all roles available in this server's shop. |

### Admin / Owner Commands
| Command | Description |
|---------|-------------|
| `/shop-add <role> <price>` | Add a role to your server shop. |
| `/shop-remove <role>` | Remove a role from the shop. |

---

## Setup & Installation

1. **Clone the repository:**
```bash
# 1. Initialize the project
npm init -y

# 2. Install dependencies
npm install
npm i discord.js ascii-table

# 3. Open JSON/config.json and write : 
# {"TOKEN" : "MzIxNTY3...abcXYZ"}
# 

# 4. Start the bot
node index.js
```
