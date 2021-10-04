const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "disconnect",
  description: "ใช้เพื่อหยุดเพลงและออกจากช่องเสียงแบบ เงียบ เงียบ ~🍋",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["leave", "exit", "quit", "dc", "stop"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ต้องเข้าช่องที่จะฟังเพลงก่อนถึงจะใช้คำสั่งนี้ได้🍋");
    if (!player) return client.sendTime(message.channel,"ไม่มีเพลงอะไรเล่นอยู่เด้ออ🍋");
    await client.sendTime(message.channel,"ออกเรียบร้อย🍋");
    await message.react("🍋");
    player.destroy();
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

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ต้องเข้าช่องที่จะฟังเพลงก่อนถึงจะใช้คำสั่งนี้ได้🍋"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          `❌ | ต้องอยู่ใน ${guild.me.voice.channel} ก่อนถึงจะใช้คำสั่งนี้ได้`
        );

      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "ไม่มีเพลงอะไรเล่นอยู่เด้ออ🍋"
        );
      player.destroy();
      client.sendTime(
        interaction,
        "ออกเรียบร้อย🍋*"
      );
    },
  },
};
