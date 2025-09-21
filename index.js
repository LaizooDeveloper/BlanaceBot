const { Client, GatewayIntentBits } = require('discord.js');
const { TOKEN } = require('./JSON/config.json');
const { readdirSync, lstatSync } = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildModeration
    ]
});

function loadHandlers(dir) {
    readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);

        if (lstatSync(filePath).isDirectory()) {
            loadHandlers(filePath); 
        } else if (file.endsWith('.js')) {
            require(filePath)(client);
            console.log(`✅ Loaded handler: ${filePath}`);
        }
    });
}

loadHandlers(path.join(__dirname, 'handlers'));

client.login(TOKEN);
