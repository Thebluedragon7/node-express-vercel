// Import packages
const Discord = require("discord.js");
const express = require("express");
const WebSocket = require("ws")
const fs = require('then-fs');
var path = require("path");
const { env } = require("process");
const client = new Discord.Client();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const home = require("./routes/home");
const token = process.env.token;
const prefix = process.env.prefix;


const app = express();
app.use(express.json());

// Routes
app.use("/home", home);

const ws = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json")

const ChatTables = {}

const payload = {
    op: 2,
    d: {
        token: token,
        intents: 513,
        properties: {
            $os: "windows",
            $browser: "chrome",
            $device: "pc"
        }
    }
}

function wait(t) {
    ms = t * 1000
    return new Promise((resolve) => setTimeout(resolve, ms));
}

ws.on("open", function open() {
    ws.send(JSON.stringify(payload))
})

ws.on("message", function incoming(data) {
    let payload = JSON.parse(data)
    const { t, event, op, d } = payload

    switch (op) {
        case 10:
            const { heartbeat_interval } = d
            interval = heartbeat(heartbeat_interval)
            break;
    };
    switch (t) {
        case "MESSAGE_CREATE":
            let author = d.author.username;
            if (d.author.bot !== true) {
                let content = d.content;
                ChatTables[d.id] = d
                console.log(d)
                console.log(author + ": " + content)
            }
        //console.log(ChatTables)
    };
})

client.on('ready', () => {
    console.log("Bot is online!");
    client.user.setActivity('My master is Unknown User UwU#3271', { type: "STREAMING" });
})

ws.on("open", function open() {
    ws.send(JSON.stringify(payload))
})

ws.on("message", function incoming(data) {
    let payload = JSON.parse(data)
    const { t, event, op, d } = payload

    switch (op) {
        case 10:
            const { heartbeat_interval } = d
            interval = heartbeat(heartbeat_interval)
            break;
    };
    switch (t) {
        case "MESSAGE_CREATE":
            let author = d.author.username;
            if (d.author.bot !== true) {
                let content = d.content;
                ChatTables[d.id] = d
                console.log(d)
                console.log(author + ": " + content)
            }
        //console.log(ChatTables)
    };
})

app.get('/', async (request, response) => {
    response.status(200).send("Welcome to the testing page");
});

app.get('/Console', async (request, response) => {
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/Test', async (request, response) => {
    response.status(200).send("This is a test");
});

app.post('/message', async (request, response) => {
    client.channels.cache.get(request.headers.channelid).send(request.headers.message);
});

app.get(`/grab-messages`, async (request, response) => {
  response.status(200).send(ChatTables)
})

app.post(`/bot-body`, async (request, response) => {
  const headers = request.headers
  let channelid = headers.channelid
  let message = headers.message;
  //let token = headers.token


  let decoded = Buffer.from(message, 'base64').toString('utf8')

  //let decoded2 = Buffer.from(token, 'base64').toString('utf8')

  fetch("https://discordapp.com/api/channels/" + channelid + "/messages", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bot ' + process.env['token'] //decoded2
    },
    body: decoded,
  });
})

app.post(`/bot-body2`, async (request, response) => {
  const headers = request.headers
  let channelid = headers.channelid
  let message = headers.message;
  //let token = headers.token


  let decoded = Buffer.from(message, 'base64').toString('utf8')

  //let decoded2 = Buffer.from(token, 'base64').toString('utf8')

  fetch("https://discordapp.com/api/channels/" + channelid + "/messages", {
    method: 'POST',
    headers: {
      'Accept': 'multipart/form-data;boundary="boundary"',
      'Content-Type': 'multipart/form-data;boundary="boundary"',
      'Authorization': 'Bot ' + process.env['token'] //decoded2
    },
    body: decoded,
  });
})

app.post(`/webhook-body`, async (request, response) => {
  const headers = request.headers
  let channelid = headers.channelid
  let message = headers.message;
  //let token = headers.token


  let decoded = Buffer.from(message, 'base64').toString('utf8')

  //let decoded2 = Buffer.from(token, 'base64').toString('utf8')

  fetch(channelid, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: decoded,
  });
  response.status(200).send(Servers);
})

client.on('guildMemberAdd', guildMember => {
    //let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'Members');
    // guildMember.roles.add(welcomeRole);
    //guildMember.send(`Welcome <@${guildMember.id}>!`);
    //guildMember.send("Please check out the <#831952145086939182> channel.");
});

client.on('guildMemberRemove', guildMember => {
    client.channels.cache.get('834187696204939285').send(`Goodbye ${guildMember.username}`);
});

const CommandList = {};
async function AddCommand(command, level, func) {
    CommandList[command] = { rank: level, run: func };
};

AddCommand("purge", 1, async function (message, client, args) {
    message.delete()
    let number = args[0]
    if (!number) return message.channel.send("Please enter the amount of messages to purge. <@" + message.author + ">")
    if (isNaN(number)) return message.channel.send("You didn't enter a number. <@" + message.author + ">");
    if (number > 100000) return message.channel.send("You can't delete more than 100 messages. <@" + message.author + ">");
    if (number < 1) return message.channel.send("You need to delete atleast one message. <@" + message.author + ">");
    message.channel.messages.fetch({ limit: number }).then(async messages => {
        message.channel.bulkDelete(messages);
        await wait(1)
        message.channel.send("Deleted (" + number + ") messages <@" + message.author + ">!").then(async msg => {
            await wait(5);
            msg.delete();
        });
    });
});;

AddCommand("verify", 1, async function (message, client, args) {
    const verifyrole = "831952145061249029";
    if (message.channel.id !== "863825174638231564") {
        return message.reply("you must do this command in <#863825174638231564>")
    };
    // await message.channel.send(mesag)
    if (message.member.roles[verifyrole]) {
        message.author.send("you're already verified.");
    } else {
        message.member.roles.add(verifyrole);
        message.author.send("You have been verified <@" + message.author.id + ">!");

        let embed = new Discord.MessageEmbed();
        embed.setColor("GREEN");
        embed.setImage("https://c.tenor.com/N9FUCYXULfYAAAAC/mlp-heart.gif")
        embed.addField("Let's welcome our new member!", "We hope you have a good time in our server :3\nAnd please check out the roles channel <#831952145086939183>");
        embed.setThumbnail(message.author.displayAvatarURL());
        embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
        client.channels.cache.get('831952145086939181').send(embed);

        //client.channels.cache.get('831952145086939181').send("Let's welcome <@"+message.author.id+"> to the server! ^w^");
    }
});

AddCommand("say", 1, async function (message, client, args) {
    var saymsg = message.content;
    message.delete()
    client.channels.cache.get(message.channel.id).send(saymsg.replace(prefix + "say", ''))
    console.log(message.author.username + ": " + message.content)
});

AddCommand("eval", 1, async function (message, client, args) {
    var saymsg = message.content;
    let code = saymsg.replace(prefix + "eval", '');
    if (!code) {
        let embed = new Discord.MessageEmbed();
        embed.setColor("RED");
        embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
        embed.setTitle("No Code Supplied");
        embed.setDescription("You didn't supply code for me to run");
        return message.channel.send(embed);
    }

    let result = "No result returned";
    let error = "No error returned";

    try {
        result = await eval(code);
    } catch (err) {
        error = err;
    }

    let embed = new Discord.MessageEmbed();
    embed.setColor("GREEN");
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    embed.setTitle("Results");
    embed.setDescription("I have successfully executed the code, here are the results");
    embed.addField("Code", "```js\n" + code + "\n```");
    embed.addField("Result", "```" + result + "```");
    embed.addField("Error", "```" + error + "```");
    return message.channel.send(embed);
});

AddCommand("uptime", 1, async function (message, client, args) {
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    message.reply(`Uptime is ${uptime}`)
})

client.on('message', (message) => {
    if (message.channel.type == 'dm') return;
    if (message.author.bot) return;
    if (message.member.roles.cache.get("831952145061249026")) {
        message.delete();
    };
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(' ');
    let command = args.shift().toLowerCase();
    let CommandInfo = CommandList[command];

    CommandInfo.run(message, client, args);
});

client.login(token);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));

const heartbeat = (ms) => {
    return setInterval(() => {
        ws.send(JSON.stringify({ op: 1, d: null }))
    }, ms)
}