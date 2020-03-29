module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp'],
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
	execute(message) {
		if (!message.mentions.users.size) {
			return message.channel.send({	files: [`${message.author.displayAvatarURL({format:'png', dynamic: true, size:2048})}`]	});
		}

		const avatarList = message.mentions.users.map(user => {
			// return `${user.username}'s avatar: , { files: [${user.displayAvatarURL({formate:'png', dynamic: true, size:2048})}]}`;
			return `${user.username}'s avatar: ${user.displayAvatarURL({format:'png', dynamic: true, size:2048})}`;
		});
		message.channel.send(avatarList);
	},
};
