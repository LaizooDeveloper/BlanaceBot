const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wallet')
        .setDescription('Check your wallet balance or someone else\'s')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to check')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const walletsPath = path.join(__dirname, '..','..', 'DATA', 'balance', 'wallets.json');

        if (!fs.existsSync(walletsPath)) {
            return interaction.reply({ content: 'Wallets file not found!', ephemeral: true });
        }

        const wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf8'));

        let userWallet = wallets[user.id];
        if (!userWallet) {
            userWallet = { bank: 0, joinedAt: new Date() };
            wallets[user.id] = userWallet;
            fs.writeFileSync(walletsPath, JSON.stringify(wallets, null, 2));
        }

        const walletEmbed = new EmbedBuilder()
            .setTitle(`💼 ${user.tag}'s Wallet`)
            .setColor('Blurple')
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '💰 Wallet', value: `\`${userWallet.wallet} $\``, inline: true },
            )
            .setFooter({ text: `User ID: ${user.id}` })
            .setTimestamp();

        await interaction.reply({ embeds: [walletEmbed], ephemeral: false });
    }
};
