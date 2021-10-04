const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "skip",
    description: "ใช้เพื่อข้ามเพลง🍋",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["s", "next"],
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
        player.stop();
        await message.react("🍋");
    },
    SlashCommand: {
        /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
        run: async (client, interaction, args, { GuildDB }) => {
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return client.sendTime(interaction, "❌ต้องเข้าช่องที่จะฟังเพลงก่อนถึงจะใช้คำสั่งนี้ได้🍋");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, "สับสนหมดแล้วว เราต้องอยู่ช่องเสียงเดียวกันก่อนถึงจะใช้คำสั่งได้🍋");

            const skipTo = interaction.data.options ? interaction.data.options[0].value : null;

            let player = await client.Manager.get(interaction.guild_id);

            if (!player) return client.sendTime(interaction, "ไม่มีเพลงอะไรเล่นอยู่เด้ออ🍋");
            console.log(interaction.data);
            if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)) return client.sendTime(interaction, "❌ | ใส่หมายเลขที่จะข้ามผิดดดด");
            player.stop(skipTo);
            client.sendTime(interaction, "ข้ามโลดดด🍋");
        },
    },
};
