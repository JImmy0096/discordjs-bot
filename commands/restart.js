module.exports = {
	name: 'restart',
	cooldown: 0,
	description: 'Restart bot(Bot owner only)',
	help_display: 'false',
	execute(message, args) {
		if (args == `3652`){
			if (message.author.id === "494481843333234728"){
				message.author.send(`Bot Restarting!`);
				console.log(`[Restarting]`);
				process.exit().catch(error => {console.log(`[Restart-Error] ${error}`)});
			}
			message.reply(`You aren't my owner, go fucking away`);
		}else{
			message.reply('Password Incorrect!');
		}
	},
};
