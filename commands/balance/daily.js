const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your public daily coins reward'),
    async execute(interaction) {
        const user = interaction.user;

        // المسار العام لملف المحافظ
        const dataPath = path.join(__dirname, '..','..', 'DATA', 'balance', 'wallets.json');

        // التأكد من وجود المجلد والملف
        if (!fs.existsSync(path.dirname(dataPath))) fs.mkdirSync(path.dirname(dataPath), { recursive: true });
        if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}, null, 2));

        let wallets = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        // إنشاء محفظة للمستخدم إذا لم تكن موجودة
        if (!wallets[user.id]) {
            wallets[user.id] = { wallet: 0, joinedAt: new Date(), lastDaily: null };
        }

        const now = new Date();
        const lastDaily = wallets[user.id].lastDaily ? new Date(wallets[user.id].lastDaily) : null;

        if (lastDaily && now.toDateString() === lastDaily.toDateString()) {
            return interaction.reply({ content: '⚠️ You already claimed your daily coins today!', ephemeral: true });
        }

        const dailyAmount = 500;
        wallets[user.id].wallet += dailyAmount;
        wallets[user.id].lastDaily = now;

        fs.writeFileSync(dataPath, JSON.stringify(wallets, null, 2));
        console.log(`✅ Daily data saved for ${user.tag}`);

        const embed = new EmbedBuilder()
            .setTitle(`🎉 Daily Reward`)
            .setDescription(`You have received **${dailyAmount} $**!\nYour new wallet balance is **${wallets[user.id].wallet} $**.`)
            .setColor('Gold')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
