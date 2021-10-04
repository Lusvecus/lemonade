const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "bump",
    description: "ใช้เพื่อเลื่อนเพลงไปข้างหน้าคิว🍋",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["b"],
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
        if (!args[0]) return client.sendTime(message.channel, "❌ | มีอะไรบางอย่างไม่ถูกต้อง ลองเช็คดูดีๆ");
        
		// Check if (args[0] - 1) is a valid index
		let trackNum = parseInt(args[0] - 1);
        if (trackNum < 1 || trackNum > player.queue.length - 1) {
			return client.sendTime(message.channel, "❌ | ใส่เลขของเพลงไม่ถูกนะ ลองเช็คดูดีๆ");
        }
        
        // Remove from and shift array
        const track = player.queue[trackNum];
        player.queue.splice(trackNum, 1);
        player.queue.unshift(track);
		client.sendTime(message.channel, "✅ | เพลง" + track.title + "ถูกเลื่อนไปหน้าคิวแล้วว🍋🍋");
    },

    SlashCommand: {
      options: [
          {
              name: "track",
              value: "track",
              type: 4,
              required: true,
              description: "ย้ายเพลงไปด้านหน้าของคิว🍋",
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
            
            let player = await client.Manager.get(interaction.guild.id);
            if (!player) return client.sendTime(interaction, "ไม่มีเพลงอะไรเล่นอยู่เด้ออ🍋");
            if (!args[0].value) return client.sendTime(interaction, "❌ | ใส่เลขของเพลงไม่ถูกนะ ลองเช็คดูดีๆ");
            
            // Check if (args[0] - 1) is a valid index
            let trackNum = parseInt(args[0].value - 1);
            if (trackNum < 1 || trackNum > player.queue.length - 1) {
                return client.sendTime(interaction, "❌ | ใส่เลขของเพลงไม่ถูกนะ ลองเช็คดูดีๆ");
            }

            // Remove from and shift array
            const track = player.queue[trackNum];
            player.queue.splice(trackNum, 1);
            player.queue.unshift(track);
            client.sendTime(interaction, "✅ | เพลง" + player.queue[0].title + "ถูกเลื่อนไปหน้าคิวแล้วว🍋🍋");
        },
    },
};