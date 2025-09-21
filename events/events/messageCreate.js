const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const COOLDOWN = 30;

const cooldowns = new Map();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return; 

        const userId = message.author.id;
        const dataPath = path.join(__dirname, '..','..', 'DATA','balance', 'wallets.json');

        if (!fs.existsSync(path.dirname(dataPath))) fs.mkdirSync(path.dirname(dataPath), { recursive: true });
        if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}, null, 2));

        const wallets = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        if (!wallets[userId]) {
            wallets[userId] = { wallet: 0, joinedAt: new Date(), lastDaily: null };
        }

        const now = Date.now();
        const lastTime = cooldowns.get(userId) || 0;

        if (now - lastTime < COOLDOWN * 1000) {
            return;
        }

        wallets[userId].wallet += 50;
        cooldowns.set(userId, now);

        fs.writeFileSync(dataPath, JSON.stringify(wallets, null, 2));
        console.log(`✅ ${message.author.tag} earned 50 coins for sending a message.`);
    }
};
