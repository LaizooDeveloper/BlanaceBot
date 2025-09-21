const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy-role')
        .setDescription('Buy a role from this server shop')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Role to buy')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;
        const role = interaction.options.getRole('role');

        const walletsPath = path.join(__dirname, '..','..','DATA', 'balance' , 'wallets.json');
        if (!fs.existsSync(walletsPath)) fs.writeFileSync(walletsPath, JSON.stringify({}, null, 2));
        const wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf8'));
        if (!wallets[user.id]) wallets[user.id] = { wallet: 0, bank: 0, joinedAt: new Date() };

        const shopPath = path.join(__dirname, '..','..','DATA','shops', `${interaction.guild.id}.json`);
        if (!fs.existsSync(shopPath)) return interaction.reply({ content: 'No shop found for this server.', ephemeral: true });
        const shop = JSON.parse(fs.readFileSync(shopPath, 'utf8'));

        if (!shop[role.id]) return interaction.reply({ content: 'This role is not in the shop.', ephemeral: true });

        const price = shop[role.id].price;
        if (wallets[user.id].wallet < price) return interaction.reply({ content: 'You do not have enough coins!', ephemeral: true });

        wallets[user.id].wallet -= price;
        fs.writeFileSync(walletsPath, JSON.stringify(wallets, null, 2));

        try {
            await interaction.member.roles.add(role);
            interaction.reply({ content: `✅ You bought **${role.name}** for ${price} coins!` });
        } catch (err) {
            console.error(err);
            interaction.reply({ content: '⚠️ Failed to assign the role. Check my permissions.', ephemeral: true });
        }
    }
};
