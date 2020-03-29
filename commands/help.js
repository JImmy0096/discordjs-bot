const Discord = require('discord.js');
const { prefix } = require('../config.json');
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
    const data = [];
    const { commands } = message.client;
		const all_cmd = commands.map(command => `${command.name}`).join('\n');

    if (!args.length) {
			const embed = new Discord.MessageEmbed()
			.setColor('AQUA')
			.setTitle('J8mmy Bot Help Manual')
			.setURL('https://discord.gg/YvqAyXU')
			.setAuthor('竺.#9220', 'https://cdn.discordapp.com/avatars/494481843333234728/cfa8ff2c7ec932296b7c677222f0bbb1.png')
			// .setDescription(`You can send \`${prefix}help [command name]\` to get info on a specific command!`)
			.setThumbnail(`https://cdn.discordapp.com/avatars/578076907975999498/79e2c18440105e2d28529af583d3bf5c.png`)
			// .addField('\u200B', '\u200B')
			.addField('*All commands:*', all_cmd, false)
			// .setImage('https://cdn.discordapp.com/icons/554967788188467225/65bcdfb9ea961cc6099e0119cb7c47c1.png')
			// .setTimestamp()
			.setFooter(`Type ${prefix}help [command name] for more info on a specific command!`);

      // data.push('Here\'s a list of all my commands:');
      // data.push(commands.map(command => `**${command.name}**`).join(', '));
      // data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

      return message.author.send(embed) //data , { split: true }
        .then(() => {
          if (message.channel.type === 'dm') return;
          message.reply('I\'ve sent you a DM with all my commands!');
        })
        .catch(error => {
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
          message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
        });
    }

    const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
	     return message.reply('that\'s not a valid command!');
     }

     data.push(`**Name:** ${command.name}`);

     if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
     if (command.description) data.push(`**Description:** ${command.description}`);
     if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

     data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

     message.channel.send(data, { split: true });

	},
};
