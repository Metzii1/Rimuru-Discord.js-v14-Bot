const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "xp-ekle",
  description: "Belirtilen kullanıcıya belirtilen miktarda XP ekler.",
  type: 1,
  options: [
    {
      name: "kullanıcı",
      description: "XP eklemek istediğiniz kullanıcıyı etiketleyin.",
      type: 6,
      required: true,
    },
    {
      name: "miktar",
      description: "Eklemek istediğiniz XP miktarını belirtin.",
      type: 4,
      required: true,
    },
  ],

  run: async (client, interaction, db) => {
    const { user, guild, options } = interaction;

    const member = guild.members.cache.get(options.getUser("kullanıcı").id);
    const xp = options.getInteger("miktar");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: "❌ | Buna Yetkin Yok!", ephemeral: true });
    }
    if (!member) {
      return interaction.reply({
        content: "Belirtilen kullanıcı bulunamadı.",
        ephemeral: true,
      });
    }

    db.add(`xpPos_${member.id}${guild.id}`, xp);

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`${member.user.username}'a ${xp} XP eklendi.`)
      .setDescription(`${member} artık ${db.fetch(`xpPos_${member.id}${guild.id}`)} XP'ye ulaştı.`);

    interaction.reply({ embeds: [embed] });
  },
};
