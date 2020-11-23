const Discord = require('discord.js')

const client = new Discord.Client()
const config = require('./.config.json')

const affirmativeWords = [
    'sim', 'yes', 'yeah', 'yep'
]

const delayedSend = (textBasedChannel, message, time) => {
    if (!time) time = Math.random();
    time *= 1000


    textBasedChannel.startTyping()
    return new Promise((res, rej) => {
        setTimeout(_ => {
            textBasedChannel.stopTyping()
            textBasedChannel.send(message)
            res(message)
        }, time)
    })
}

const getMessageFrom = (textBasedChannel, user) => {
    let collector = textBasedChannel.createMessageCollector(m => m.author.id == user.id, {max: 1})
    return new Promise((res, rej) => {
        collector.on('collect', m => {
            res(m)
        })
    })
}

client.on('ready', () => {
    console.log('Ravac on')
    client.on('message', (message) => {
        if (!(message.content == '!start')) return

        let user = message.author

        user.createDM().then(async ch => {
            // https://dev.to/aumayeung/where-s-the-sleep-function-in-javascript-bk8
            let messages = [
                `Olá, __${user.username}__, seja bem vindo ao servidor do Professor Ranieri.`,
                `Eu sou o **RaVaC Bot**, um dos bots do professor, e minha função aqui é organizar a casa.`,
                `Pra isso, vou precisar te fazer algumas perguntas rápidas.`,
                `Digite o seu nome verdadeiro (aquele que vai aparecer para todos no server, inclusive para o professor)?`
            ]
            for await (let m of messages) {
                // ch.startTyping()
                await delayedSend(ch, m)
            }
            let correctName = false
            let first = true
            while (!correctName) {
                await getMessageFrom(ch, user).then(async m => {
                    await delayedSend(ch, `Seu nome real é **${m.content}**, certo?`)
                    if (!first) {
                        await delayedSend(ch, '(Dica: tenta responder com `sim` ou `não` que fica mais fácil pra entender)')
                    }
                })
                await getMessageFrom(ch, user).then(m => {
                    m = m.content.toLowerCase().replace(/[âãáàä]/, 'a')
                    let affirmative = m == 's'
                    affirmativeWords.forEach(word => affirmative |= m.includes(word))
                    if (affirmative) {
                        correctName = true
                    }
                })
                if (!correctName) {
                    delayedSend(ch, 'Parece que não... Então digita o seu nome certo agora ;)')
                }
                first = false
            }
            await delayedSend(ch, `Valeu! Agora me responde, vc estuda no Campus Igarassu do IFPE ou não?`)

        })
    })
    // client.on('guildMemberAdd', (member) => {
    //     let user = member.user
    //     user.createDM().then(dmCh => {
    //         console.log(dmCh)
    //         dmCh.send(`Olá, __${user.username}__, seja bem vindo ao servidor do Professor Ranieri.`)
    //         dmCh.send(`Eu sou o **RaVaC Bot**, um dos bots do professor, e minha função aqui é organizar a casa.`)
    //         dmCh.send(`Pra isso, vou precisar te fazer algumas perguntas rápidas.`)
    //         dmCh.send(`Qual teu nome?`)

    //     })

    // })
})

client.login(config.token)