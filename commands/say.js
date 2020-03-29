module.exports = {
	name: 'say',
	cooldown: 0,
	description: 'Say a message.',
	guildOnly: true,
	execute(message, args) {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});
    message.channel.send(sayMessage);
	},
};
