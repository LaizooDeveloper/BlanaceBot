const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Give coins to another user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to give coins to')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of coins to give')
                .setRequired(true)
        ),
    async execute(interaction) {
        const sender = interaction.user;
        const recipient = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (recipient.bot) {
            return interaction.reply({ content: '⚠️ You cannot give coins to a bot!', ephemeral: true });
        }
        if (recipient.id === sender.id) {
            return interaction.reply({ content: '⚠️ You cannot give coins to yourself!', ephemeral: true });
        }
        if (amount <= 0) {
            return interaction.reply({ content: '⚠️ Amount must be greater than 0!', ephemeral: true });
        }

        const walletsPath = path.join(__dirname, '..','..', 'DATA', 'balance', 'wallets.json');
        if (!fs.existsSync(walletsPath)) {
            fs.mkdirSync(path.dirname(walletsPath), { recursive: true });
            fs.writeFileSync(walletsPath, JSON.stringify({}, null, 2));
        }

        let wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf8'));

        if (!wallets[sender.id]) wallets[sender.id] = { wallet: 0, joinedAt: new Date(), lastDaily: null };
        if (!wallets[recipient.id]) wallets[recipient.id] = { wallet: 0, joinedAt: new Date(), lastDaily: null };

        if (wallets[sender.id].wallet < amount) {
            return interaction.reply({ content: '⚠️ You do not have enough coins!', ephemeral: true });
        }

        wallets[sender.id].wallet -= amount;
        wallets[recipient.id].wallet += amount;

        fs.writeFileSync(walletsPath, JSON.stringify(wallets, null, 2));

        const embed = new EmbedBuilder()
            .setTitle('💸 Coins Transferred')
            .setDescription(`**${sender.tag}** gave **${amount} $** to **${recipient.tag}**!`)
            .addFields(
                { name: `${sender.tag}'s Wallet`, value: `\`${wallets[sender.id].wallet} $\``, inline: true },
                { name: `${recipient.tag}'s Wallet`, value: `\`${wallets[recipient.id].wallet} $\``, inline: true }
            )
            .setColor('Green')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
