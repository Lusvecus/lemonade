const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "move",
    description: "ใช้เพื่อย้ายคิวเพลงไปยังคิวที่ระบุ🍋",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["m"],
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
        if (!args[0] || !args[1]) return client.sendTime(message.channel, "❌ | **Invalid arguments.**");
        
		// Check if (args[0] - 1) is a valid index
		let trackNum = parseInt(args[0] - 1);
        if (trackNum < 1 || trackNum > player.queue.length - 1) {
			return client.sendTime(message.channel, "❌ | **Invalid track number.**");
        }
        
        let dest = parseInt(args[1] - 1);
        if (dest < 1 || dest > player.queue.length - 1) {
			return client.sendTime(message.channel, "❌ | **Invalid track destination.**");
        }
        
        // Remove from and shift array
        const track = player.queue[trackNum];
        player.queue.splice(trackNum, 1);
        player.queue.splice(dest, 0, track);
		client.sendTime(message.channel, "✅ | **" + track.title + "** has been moved to position " + (dest + 1) + ".");
    },

    SlashCommand: {
      options: [
          {
              name: "track",
              value: "track",
              type: 4,
              required: true,
              description: "ใช้เพื่อเลือกเพลงเลยว่าจะย้ายเพลงไหน",
          },   
          {
              name: "position",
              value: "track2",
              type: 4,
              required: true,
              description: "ย้ายเพลงที่เลือกไปยังตำแหน่งที่ระบุ",
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
            if (!player) return client.sendTime(interaction, "❌ | **Nothing is playing right now...**");
            if (!args[0].value || !args[1].value) return client.sendTime(interaction, "❌ | **Invalid track number.**");
            
            // Check if (args[0] - 1) is a valid index
            let trackNum = parseInt(args[0].value - 1);
            if (trackNum < 1 || trackNum > player.queue.length - 1) {
                return client.sendTime(interaction, "❌ | **Invalid track number.**");
            }

            let dest = parseInt(args[1].value - 1);
            if (dest < 1 || dest > player.queue.length - 1) {
                return client.sendTime(interaction, "❌ | **Invalid track destination.**");
            }

            // Remove from and shift array
            const track = player.queue[trackNum];
            player.queue.splice(trackNum, 1);
            player.queue.splice(dest, 0, track);
            client.sendTime(interaction, "✅ | **" + track.title + "** has been moved to position " + (dest + 1) + ".");
        },
    },
};