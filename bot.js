const fs = require('fs');
const Discord = require('discord.js');

//pm2 io
const io = require('@pm2/io')
io.init({
  transactions: true // will enable the transaction tracing
})

const client = new Discord.Client();
const {
	prefix,
	token,
	moderator_id
} = require(__dirname + '/config.json');

// level system
//const fs = require("fs");
//let db = JSON.parse(fs.readFileSync("./database.json", "utf8"));

client.commands = new Discord.Collection();

//匯入command
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

//匯入command
for (const file of commandFiles) {
	const command = require( __dirname + `/commands/${file}`);
	client.commands.set(command.name, command);
}

//cooldown
const cooldowns = new Discord.Collection();

// Listening for reactions on old messages
//const client_2 = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

//ready
client.once('ready', () => {
	console.log('[Info] Ready!');
	try {
		// activity.type: PLAYING, STREAMING, LISTENING, WATCHING, CUSTOM_STATUS 訂製
		// ststus: online, idle, invisible, dnd
		client.user.setPresence({ activity: { name: `${prefix}help`, type:'WATCHING'}, status: 'idle'});
	} catch (error) {
		console.log(`[Error] ${error}`);
	}
});

client.on("guildCreate", guild => {
  console.log(`[Info] New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  console.log(`[Info] I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on('shardError', error => {
	 console.error('[Error] Websocket連接出錯:', error);	//A websocket connection encountered an error
});

process.on('unhandledRejection', error => {
	console.error('[Error] 未處理的承諾被拒絕:', error);	//Unhandled promise rejection
});

process.on('warning', console.warn);

client.on('message', message => {
	try {
		console.log(`[Message-Log] ${message.author.tag}(${message.author.displayName}):	${message.content}`);
	} catch (error) {
		console.log(`[Error] Log message error!`);
		console.error(error);
	}

	if(message.content  == `<@!578076907975999498>`) message.reply(`Why are you fucking ping me?`);

	//如果在554967788188467225,則確認快速刪除訊息
	try {
    if (message.channel.type == 'text') {
      if(message.guild.id == '554967788188467225' || '554943597171179521'){
  			if(message.content.includes(`:589270496663699467>`))	{
  				if(!moderator_id.includes(message.member.user.id)) message.delete().catch(err => {console.log(err);});
  			}
        message.react('😶');
  			const filter = (reaction, user) => {
  				return ['😶'].includes(reaction.emoji.name) && moderator_id.includes(user.id);
  			};
  			message.awaitReactions(filter, { max: 1, errors: ['time'] })
  				.then(collected => {
  					const reaction = collected.first();
  					if (reaction.emoji.name === '😶') {
  						message.delete().catch(err => {
  							console.log(err);
  						});
  					}
  				})
  				.catch(collected => {});
  			}
    }
  }catch (error) {
    console.log('[Error] Create: ', error);
  }

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const commandName = args.shift().toLowerCase();

  if (message.channel.type == 'text') {
    if (!message.member.roles.cache.some(role => role.name === 'Moderator') || !message.member.hasPermission('ADMINISTRATOR')) return;
  }

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

  // permission
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	//cooldown
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(3)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

timestamps.set(message.author.id, now);
setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

// Listening for reactions on old messages
client.on('messageReactionAdd', async (reaction, user) => {
	if (user.id == '578076907975999498') return;
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('[Error] Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	// Now the message has been cached and is fully available
	console.log(`[Message-Reaction-Add] ${user.tag}(${reaction.message.author}) is message "${reaction.message.content}"(${reaction.message.id}) gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`[Message-Reaction-Add] ${reaction.count} user(s) have given the same reaction to this message!`);
});

client.login(token);
