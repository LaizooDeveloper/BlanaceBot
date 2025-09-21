const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop-add')
        .setDescription('Add a role to your server shop (Admin only)')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Role to sell')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('price')
                .setDescription('Price in coins')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({ content: '⚠️ Only the server owner can use this command.', ephemeral: true });
        }

        const role = interaction.options.getRole('role');
        const price = interaction.options.getInteger('price');

        const shopDir = path.join(__dirname, '..','..','DATA','shops');
        if (!fs.existsSync(shopDir)) fs.mkdirSync(shopDir, { recursive: true });

        const shopPath = path.join(shopDir, `${interaction.guild.id}.json`);
        if (!fs.existsSync(shopPath)) fs.writeFileSync(shopPath, JSON.stringify({}, null, 2));

        const shop = JSON.parse(fs.readFileSync(shopPath, 'utf8'));
        shop[role.id] = { name: role.name, price: price };
        fs.writeFileSync(shopPath, JSON.stringify(shop, null, 2));

        await interaction.reply({ content: `✅ ${role.name} added to your server shop for ${price} coins.` });
    }
};
