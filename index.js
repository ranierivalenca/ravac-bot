const Discord = require('discord.js')
const welcome = require('./welcome')

const client = new Discord.Client()
const config = require('./.config.json')


client.on('ready', () => {
    console.log('Ravac on')

    const guild = client.guilds.resolve(config.guildId)

    client.on('message', (message) => {
        if (!(message.content == '!welcome'))
            return
        welcome(message.author, guild)
    })

    client.on('guildMemberAdd', (member) => {
        welcome(member.user, guild)
    })
})

client.login(config.token)