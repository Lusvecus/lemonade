const { MessageEmbed, MessageReaction } = require("discord.js");

module.exports = {
  name: "config",
  description: "ปรับการตั้งค่าบอท(ดีอยู่แล้วไม่ต้องปรับหรอกก)🍋",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["ADMINISTRATOR"],
  },
  aliases: ["conf"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Config = new MessageEmbed()
      .setAuthor("Server Config", client.botconfig.IconURL)
      .setColor(client.botconfig.EmbedColor)
      .addField("Prefix", GuildDB.prefix, true)
      .addField("DJ Role", GuildDB.DJ ? `<@&${GuildDB.DJ}>` : "Not Set", true)
      .setDescription(`
What would you like to edit?

:one: - Server Prefix
:two: - DJ Role
`);

    let ConfigMessage = await message.channel.send(Config);
    await ConfigMessage.react("1️⃣");
    await ConfigMessage.react("2️⃣");
    let emoji = await ConfigMessage.awaitReactions(
      (reaction, user) =>
        user.id === message.author.id &&
        ["1️⃣", "2️⃣"].includes(reaction.emoji.name),
      { max: 1, errors: ["time"], time: 30000 }
    ).catch(() => {
      ConfigMessage.reactions.removeAll();
      client.sendTime(
        message.channel, "❌ | ใช้เวลาตอบกลับนานไป๊ หากต้องการตั้งค่าบอทลองพิมคำสั่งใหม่อีกครั้งนะ"
      );
      ConfigMessage.delete(Config);
    });
    let isOk = false;
    try {
      emoji = emoji.first();
    } catch {
      isOk = true;
    }
    if (isOk) return; //im idiot sry ;-;
    /**@type {MessageReaction} */
    let em = emoji;
    ConfigMessage.reactions.removeAll();
    if (em._emoji.name === "1️⃣") {
      await client.sendTime(message.channel, "อยากเปลี่ยน prefix เป็นอะไรดี ?");
      let prefix = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!prefix.first())
        return client.sendTime(message.channel, "คุณใช้เวลานานเกินกว่าจะตอบกลับ");
      prefix = prefix.first();
      prefix = prefix.content;

      await client.database.guild.set(message.guild.id, {
        prefix: prefix,
        DJ: GuildDB.DJ,
      });

      client.sendTime(
        message.channel, `🍋เรียบร้อยเปลี่ยน prefix เป็น \`${prefix}\``
      );
    } else {
      await client.sendTime(
        message.channel, "ระบุบทบาทที่ต้องการให้มี `DJ's` "
      );
      let role = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!role.first())
        return client.sendTime(message.channel, "คุณใช้เวลานานเกินกว่าจะตอบกลับ");
      role = role.first();
      if (!role.mentions.roles.first())
        return client.sendTime(
          message.channel, "ระบุบทบาทที่มีเฉพาะ DJ's เท่านั้น"
        );
      role = role.mentions.roles.first();

      await client.database.guild.set(message.guild.id, {
        prefix: GuildDB.prefix,
        DJ: role.id,
      });

      client.sendTime(
        message.channel, "เรียบร้อยตั้งบทบาท DJ ให้กับ <@&" + role.id + ">"
      );
    }
  },

  SlashCommand: {
    options: [
      {
        name: "prefix",
        description: "ใช้เพื่อดู prefix ของบอท",
        type: 1,
        required: false,
        options: [
          {
            name: "symbol",
            description: "ใช้เพื่อตั้ง prefix ของบอทเอง",
            type: 3,
            required: false,
          },
        ],
      },
      {
        name: "dj",
        description: "ใช้เพื่อเช็คบดบาท DJ ",
        type: 1,
        required: false,
        options: [
          {
            name: "role",
            description: "ใช้เพื่อตั้งบทบาท DJ ",
            type: 8,
            required: false,
          },
        ],
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
      let config = interaction.data.options[0].name;
      let member = await interaction.guild.members.fetch(interaction.user_id);
      //TODO: if no admin perms return...
      if (config === "prefix") {
        //prefix stuff
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          //has prefix
          let prefix = interaction.data.options[0].options[0].value;
          await client.database.guild.set(interaction.guild.id, {
            prefix: prefix,
            DJ: GuildDB.DJ,
          });
          client.sendTime(interaction, `เรียบร้อยตั้ง prefix เป็น \`${prefix}\``);
        } else {
          //has not prefix
          client.sendTime(interaction, `prefix ของเซิฟเวอร์นี้คือ \`${GuildDB.prefix}\``);
        }
      } else if (config === "djrole") {
        //DJ role
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          let role = interaction.guild.roles.cache.get(
            interaction.data.options[0].options[0].value
          );
          await client.database.guild.set(interaction.guild.id, {
            prefix: GuildDB.prefix,
            DJ: role.id,
          });
          client.sendTime(
            interaction, `เรียบร้อยตั้งบทบาทดีเจของเซิฟนี้เป็น ${role.name}`
          );
        } else {
          /**
           * @type {require("discord.js").Role}
           */
          let role = interaction.guild.roles.cache.get(GuildDB.DJ);
          client.sendTime(interaction, `บทบาทดีเจของเซิฟนี้มี ${role.name}`);
        }
      }
    },
  },
};
