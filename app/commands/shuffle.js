const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "shuffle",
    description: "ใช้เพื่อเปลี่ยนคิวเพลง(วงเล็บเฉยๆไม่มีอะไร)🍋",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["shuff"],
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
        if (!player.queue || !player.queue.length || player.queue.length === 0) return client.sendTime(message.channel, "❌ | เพลงน้อยเกินกว่าที่จะเปลี่ยนคิวได้🍋");
        player.queue.shuffle();
        await client.sendTime(message.channel, "✅ | เปลี่ยนคิวแล้ว!");
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

            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction.channel, "ไม่มีเพลงอะไรเล่นอยู่เด้ออ🍋");
            if (!player.queue || !player.queue.length || player.queue.length === 0) return client.sendTime(interaction, "❌ | เพลงน้อยเกินกว่าที่จะเปลี่ยนคิวได้🍋");
            player.queue.shuffle();
            client.sendTime(interaction, "✅ | เปลี่ยนคิวแล้ว!");
        },
    },
};
