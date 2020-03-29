module.exports = {
	name: 'test',
	aliases: [],
	cooldown: 0,
	description: 'Command for testing somthing.',
	execute(message) {
		// put command there

		if (!message.mentions.users.size) {
			return message.channel.send({	files: [`${message.author.displayAvatarURL({formate:'jpg', dynamic: true, size:2048})}`]	});
		}

		// return message.channel.send({ files: ['https://cdn.discordapp.com/attachments/692078244551458856/693668840873132062/cfa8ff2c7ec932296b7c677222f0bbb1.png'] });

	},
};
