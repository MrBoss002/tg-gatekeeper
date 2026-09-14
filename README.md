<div align="center">

# @mrboss002/tg-gatekeeper 🛡️

A lightweight, universal **Telegram Force-Subscribe Middleware** engine for Node.js bots. Plug into any Private Chat Bot (Auto Filter, File Store, Media Search) or Group Management Bot with just **2 lines of code**.

</div>

---

## ✨ Features

- 🚀 **Plug & Play**: Integrates seamlessly in 2 lines of code with gramY.
- 📢 **Multi-Channel Support**: Require users to join 1, 2, or 5+ channels.
- ⏱️ **Auto-Clean Group Warning**: Auto-deletes bot warning messages after 30 seconds to keep group chats clean.
- 🔔 **Private Alert Pop-ups**: Instant phone pop-up alerts (`show_alert: true`) when users tap verify without joining.
- ⚙️ **Env & Code Support**: Pass channels via arrays or environment variables (`process.env.REQUIRED_CHANNELS`).

---

## 📦 Installation

```bash
npm install @mrboss002/tg-gatekeeper

```

---

## 🚀 Quick Start (gramY Example)

```JavaScript
const { Bot } = require("grammy");
const { gatekeeper } = require("@mrboss002/tg-gatekeeper");

const bot = new Bot("YOUR_TELEGRAM_BOT_TOKEN");

// Add Force-Subscribe Gatekeeper (Checks before processing any message)
bot.use(
  gatekeeper({
    channels: ["@YourChannelOne", "@YourChannelTwo"],
    autoDeleteSeconds: 30, // Auto-delete group warning after 30s
    customMessage: "⚠️ **Access Denied!**\nPlease join our channel to use this bot and chat here."
  })
);

bot.command("start", (ctx) => ctx.reply("Welcome to the bot! 🎉"));

bot.start();

```

---

## ⚙️ Options & Configuration

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `channels` | `string[] \| string` | **Required** | Array of channel usernames (`["@ch1", "@ch2"]`) or comma-separated string. |
| `autoDeleteSeconds` | `number` | `30` | Time in seconds before deleting group alerts. Set to `0` to disable auto-delete. |
| `customMessage` | `string` | Default Text | Custom warning text when access is denied. Supports Markdown. |
| `verifyButtonText` | `string` | `"✅ I Have Joined"` | Text displayed on the verification inline button. |

---

## 📄 License
> Distributed under the MIT License. See LICENSE for more information. Permission is hereby granted, free of charge, to any person obtaining a copy of this software to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies.

---

<div align="center">

## ☕ Support & Community

**If `@mrboss002/tg-gatekeeper` saved you time or enhanced your workflow, consider starring the repository ⭐️ or supporting the ongoing development and maintenance of this project!**

| ☕ Support Developer | 🌐 Official Channel | ⛑ Need Assistance |
| :---: | :---: | :---: |
| [![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/MrBoss002) | [![Powered By](https://img.shields.io/badge/Powered%20By-%40MrBossTG-FF0055?style=for-the-badge&logo=telegram&logoColor=blue)](https://t.me/MrBossTG) | [![Dev Help](https://img.shields.io/badge/Contact-Developer-229ED9?style=for-the-badge&logo=telegram&logoColor=blue)](https://t.me/ZeroTwoCare) |

<br />

[![Developed By](https://img.shields.io/badge/Developed%20By-%40MrBoss002-00C853?style=flat-square&logo=github)](https://github.com/MrBoss002)

**tg-gatekeeper** — Crafted with ❤️ for Telegram bot developers worldwide.

</div>


