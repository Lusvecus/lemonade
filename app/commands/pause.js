const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "pause",
    description: "ใช้เพื่อหยุดเพลงแบบชั่วคราว🍋",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
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
        if (player.paused) return client.sendTime(message.channel, "❌ | **Music is already paused!**");
        player.pause(true);
        let embed = new MessageEmbed().setAuthor(`Paused!`, client.botconfig.IconURL).setColor(client.botconfig.EmbedColor).setDescription(`Type \`${GuildDB.prefix}resume\` to continue playing!`);
        await message.channel.send(embed);
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

            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "ไม่มีเพลงอะไรเล่นอยู่เด้ออ🍋");
            if (player.paused) return client.sendTime(interaction, "Music is already paused!");
            player.pause(true);
            client.sendTime(interaction, "**⏸ หยุดชั่วคราว**");
        },
    },
};
