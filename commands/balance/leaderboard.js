const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show the top 10 users with the highest wallet balance'),
    async execute(interaction) {
        const walletsPath = path.join(__dirname, '..','..', 'DATA', 'balance', 'wallets.json');

        if (!fs.existsSync(walletsPath)) {
            return interaction.reply({ content: 'Wallets file not found!', ephemeral: true });
        }

        const wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf8'));

        const sorted = Object.entries(wallets)
            .sort(([, a], [, b]) => b.wallet - a.wallet)
            .slice(0, 10); 

        if (sorted.length === 0) {
            return interaction.reply({ content: 'No users found in the leaderboard.', ephemeral: true });
        }

        let description = '';
        for (let i = 0; i < sorted.length; i++) {
            const [userId, data] = sorted[i];
            const user = await interaction.client.users.fetch(userId).catch(() => ({ tag: 'Unknown User' }));
            description += `**${i + 1}. ${user.tag}** — \`${data.wallet} $\`\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle('🏆 Wallet Leaderboard')
            .setDescription(description)
            .setColor('Gold')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
