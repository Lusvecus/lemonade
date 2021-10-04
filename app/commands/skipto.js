const { MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");

module.exports = {
  name: "skipto",
  description: `ใช้เพื่อข้ามเพลงเหมือนกัน แต่สามารถเลือกได้ว่าจะข้ามไปเพลงไหนในคิว🍋`,
  usage: "<number>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["st"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    const player = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false,
    });

    if (!player) return client.sendTime(message.channel, "ไม่มีเพลงอะไรเล่นอยู่เด้ออ🍋");
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ต้องเข้าช่องที่จะฟังเพลงก่อนถึงจะใช้คำสั่งนี้ได้🍋");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, "สับสนหมดแล้วว เราต้องอยู่ช่องเสียงเดียวกันก่อนถึงจะใช้คำสั่งได้🍋");

    try {
      if (!args[0]) return client.sendTime(message.channel, `**Usage**: \`${GuildDB.prefix}skipto [number]\``);
      //if the wished track is bigger then the Queue Size
      if (Number(args[0]) > player.queue.size) return client.sendTime(message.channel, `❌ | เอิ่ม เพลงนั้นไม่ได้อยู่ในคิวนะ! ลองใหม่อีกครั้งง!`);
      //remove all tracks to the jumped song
      player.queue.remove(0, Number(args[0]) - 1);
      //stop the player
      player.stop();
      //Send Success Message
      return client.sendTime(message.channel, `⏭ ข้ามเพลง \`${Number(args[0] - 1)}\` `);
    } catch (e) {
      console.log(String(e.stack).bgRed);
      client.sendError(message.channel, "Something went wrong.");
    }
  },
  SlashCommand: {
    options: [
      {
        name: "position",
        value: "[position]",
        type: 4,
        required: true,
        description: "ใช้เพื่อข้ามเพลงเฉพาะในคิว🍋",
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
      const voiceChannel = member.voice.channel;
      let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
      if (!member.voice.channel) return client.sendTime(interaction, "❌ต้องเข้าช่องที่จะฟังเพลงก่อนถึงจะใช้คำสั่งนี้ได้🍋");
      if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `สับสนหมดแล้วว เราต้องอยู่ช่องเสียงเดียวกันก่อนถึงจะใช้คำสั่งได้🍋`);
      let CheckNode = client.Manager.nodes.get(client.botconfig.Lavalink.id);
      if (!CheckNode || !CheckNode.connected) {
        return client.sendTime(interaction, "❌ | **Lavalink node not connected**");
      }

      let player = client.Manager.create({
        guild: interaction.guild_id,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channel_id,
        selfDeafen: false,
      });

      try {
        if (!interaction.data.options) return client.sendTime(interaction, `**Usage**: \`${GuildDB.prefix}skipto <number>\``);
        let skipTo = interaction.data.options[0].value;
        //if the wished track is bigger then the Queue Size
        if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)) return client.sendTime(interaction, `❌ | เอิ่ม เพลงนั้นไม่ได้อยู่ในคิวนะ! ลองใหม่อีกครั้งง!`);

        player.stop(skipTo);
        //Send Success Message
        return client.sendTime(interaction, `⏭ ข้ามเพลง \`${Number(skipTo)}\` `);
      } catch (e) {
        console.log(String(e.stack).bgRed);
        client.sendError(interaction, "มีอะไรบางอย่างผิดปกตินะ บรึ๋ย~");
      }
    },
  },
};
