const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        
        const guildConfigPath = path.join(__dirname, '..','..', 'DATA', 'guilds', `${guild.id}.json`);
        if (!fs.existsSync(path.dirname(guildConfigPath))) {fs.mkdirSync(path.dirname(guildConfigPath), { recursive: true });}
        if (!fs.existsSync(guildConfigPath)) {fs.writeFileSync(guildConfigPath, JSON.stringify({ prefix: "!", settings: {} }, null, 2));}

        const dataPath = path.join(__dirname, '..','..', 'DATA', 'balance', 'wallets.json');
        if (!fs.existsSync(path.dirname(dataPath))) fs.mkdirSync(path.dirname(dataPath), { recursive: true });
        if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}, null, 2));

        let wallets = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        const members = await guild.members.fetch();
        members.forEach(member => {
            if (!member.user.bot) {
                if (!wallets[member.id]) {
                    wallets[member.id] = {
                        wallet: 0,
                        tag: member.tag
                    };
                }
            }
        });

        fs.writeFileSync(dataPath, JSON.stringify(wallets, null, 2));

        console.log(`✅ Wallets updated for all members of guild: ${guild.name}`);
    }
};
