const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop-list')
        .setDescription('Show the roles available for purchase in this server shop'),
    async execute(interaction) {
        const shopPath = path.join(__dirname, '..','..','DATA','shops', `${interaction.guild.id}.json`);
        if (!fs.existsSync(shopPath)) {
            return interaction.reply({ content: '⚠️ This server does not have a shop yet.', ephemeral: true });
        }

        const shop = JSON.parse(fs.readFileSync(shopPath, 'utf8'));
        if (Object.keys(shop).length === 0) {
            return interaction.reply({ content: '⚠️ The shop is empty.', ephemeral: true });
        }

        let description = '';
        for (const [roleId, info] of Object.entries(shop)) {
            description += `**${info.name}** — \`${info.price} $\`\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`🛒 Server Shop`)
            .setDescription(description)
            .setColor('Green')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
