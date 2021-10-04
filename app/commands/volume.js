const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "volume",
    description: "ใช้เพื่อดูระดับเสียง หรือ เพิ่ม ลดเสียง🍋",
    usage: "<volume>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["vol", "v"],
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
        if (!args[0]) return client.sendTime(message.channel, `🔉 |ระดับเสียงตอนนี้อยู่ที่🍋\`${player.volume}\`.`);
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ต้องเข้าช่องที่จะฟังเพลงก่อนถึงจะใช้คำสั่งนี้ได้🍋");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, "สับสนหมดแล้วว เราต้องอยู่ช่องเสียงเดียวกันก่อนถึงจะใช้คำสั่งได้🍋");
        if (!parseInt(args[0])) return client.sendTime(message.channel, `เลือกระดับเสียงระหว่าง \`1 - 100\``);
        let vol = parseInt(args[0]);
        if(vol < 0 || vol > 100){
          return  client.sendTime(message.channel, "❌ | กรุณาเลือกระดับเสียงระหว่าง `1-100`**");
        }
        else{
        player.setVolume(vol);
        client.sendTime(message.channel, `🔉 | ปรับระดับเสียงเป็น \`${player.volume}\``);
        }
    },
    SlashCommand: {
        options: [
            {
                name: "amount",
                value: "amount",
                type: 4,
                required: false,
                description: "ใช้เพื่อเพิ่มลดเสียงจาก 1-100 (ค่าเริ่มต้นคือ100)🍋",
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
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return client.sendTime(interaction, "ต้องเข้าช่องที่จะฟังเพลงก่อนถึงจะใช้คำสั่งนี้ได้🍋");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, "สับสนหมดแล้วว เราต้องอยู่ช่องเสียงเดียวกันก่อนถึงจะใช้คำสั่งได้🍋");
            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "ไม่มีเพลงอะไรเล่นอยู่เด้ออ🍋");
            if (!args[0].value) return client.sendTime(interaction, `🔉 | ระดับเสียงตอนนี้อยู่ที่🍋 \`${player.volume}\`.`);
            let vol = parseInt(args[0].value);
            if (!vol || vol < 1 || vol > 100) return client.sendTime(interaction, `เลือกระดับเสียงระหว่าง \`1 - 100\``);
            player.setVolume(vol);
            client.sendTime(interaction, `🔉 | ปรับระดับเสียงเป็น \`${player.volume}\``);
        },
    },
};
