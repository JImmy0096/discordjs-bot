const Discord = require('discord.js');
module.exports = {
	name: 'verification',
	cooldown: 0,
  aliases: ['v'],
	description: 'Command for testing somthing.',
	execute(message) {
    const embed = new Discord.MessageEmbed()
    .setColor('AQUA')
    .setTitle('請驗證你的帳號・∀・')
    .setURL('https://discord.gg/YvqAyXU')
    .setAuthor('L.S.N.R.T.C林森北路教學中心', 'https://cdn.discordapp.com/icons/554967788188467225/65bcdfb9ea961cc6099e0119cb7c47c1.webp')
    .setThumbnail(`https://cdn.discordapp.com/icons/554967788188467225/65bcdfb9ea961cc6099e0119cb7c47c1.webp`)
    // .addField('\u200B', '\u200B')
    .addField('⠀', '為取得更多此伺服器的權限,請點擊此訊息下方的回應,對 :white_check_mark: 的表情符號反應,如果它沒有作用,請DM 竺.#9220,我們對此感到抱歉', false);
    message.channel.send(embed);

	},
};
