const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const levels = {
    none: 0.0,
    low: 0.2,
    medium: 0.3,
    high: 0.35,
};
module.exports = {
    name: "bassboost",
    description: "ใช้เพื่อเพิ่มเบสให้หนักแน่นมากขึ้นแบบ ใ จ เ ก เ ร 🍋",
    usage: "<none|low|medium|high>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["bb", "bass"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {

        let player = await client.Manager.get(message.guild.id);
        if (!player) return client.sendTime(message.channel, "ไม่มีเพลงอะไรเล่นอยู่เด้ออ🍋");
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ต้องเข้าช่องที่จะฟังเพลงก่อนถึงจะใช้คำสั่งนี้ได้🍋");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, "สับสนหมดแล้วว เราต้องอยู่ช่องเสียงเดียวกันก่อนถึงจะใช้คำสั่งได้🍋");

        if (!args[0]) return client.sendTime(message.channel, "🍋เลือกระดับของ bassboost \nAvailable Levels:** `none`, `low`, `medium`, `high`"); //if the user do not provide args [arguments]

        let level = "none";
        if (args.length && args[0].toLowerCase() in levels) level = args[0].toLowerCase();

        player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));

        return client.sendTime(message.channel, `✅ | เรียบร้อยคั๊พปรับ bassboost เป็น \`${level}\``);
    },
    SlashCommand: {
        options: [
            {
                name: "level",
                description: `เลือกระดับของ bassboost Levels: low, medium, high, or none`,
                value: "[level]",
                type: 3,
                required: true,
            },
        ],
        /**
         *
         * @param {import("../structures/DiscordMusicBot")} client
         * @param {import("discord.js").Message} message
         * @param {string[]} args
         * @param {*} param3
         */

        run: async (client, interaction, args, { GuildDB }) => {
            const levels = {
                none: 0.0,
                low: 0.2,
                medium: 0.3,
                high: 0.35,
            };

            let player = await client.Manager.get(interaction.guild_id);
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);
            const voiceChannel = member.voice.channel;
            if (!player) return client.sendTime(interaction, "ไม่มีเพลงอะไรเล่นอยู่เด้ออ🍋");
            if (!member.voice.channel) return client.sendTime(interaction, "❌ต้องเข้าช่องที่จะฟังเพลงก่อนถึงจะใช้คำสั่งนี้ได้🍋");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(voiceChannel)) return client.sendTime(interaction, "สับสนหมดแล้วว เราต้องอยู่ช่องเสียงเดียวกันก่อนถึงจะใช้คำสั่งได้🍋");
            if (!args) return client.sendTime(interaction, "**Please provide a bassboost level. \nAvailable Levels:** `none`, `low`, `medium`, `high`"); //if the user do not provide args [arguments]

            let level = "none";
            if (args.length && args[0].value in levels) level = args[0].value;

            player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));

            return client.sendTime(interaction, `✅ | เรียบร้อยคั๊พปรับ bassboost เป็น \`${level}\``);
        },
    },
};
