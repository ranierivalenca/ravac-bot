const Discord = require('discord.js')
const welcome = require('./welcome')

const client = new Discord.Client()
const config = require('./.config.json')


client.on('ready', () => {
    console.log('Ravac on')

    client.on('message', (message) => {
        if (!(message.content == '!welcome'))
            return
        welcome(message.author)

    })

    client.on('guildMemberAdd', (member) => {
        welcome(member.user)
    })
})

client.login(config.token)