// https://stackoverflow.com/questions/16631064/declare-multiple-module-exports-in-node-js
const {
    delayedSend,
    timedInteraction
} = require('./functions')

const Discord = require('discord.js')


let realName, course, semester


const welcomeAndGetName = async (ch, user) => {
    // https://dev.to/aumayeung/where-s-the-sleep-function-in-javascript-bk8
    let welcomeEmbed = new Discord.MessageEmbed({
        'color': '#ff9900',
        'title': `Oi, ${user.username}! Bem vind_x_ ao servidor do Professor Ranieri`,
        'description': 'Eu sou o **RaVaC **, um dos bots do professor, e minha função aqui é organizar a casa.\n\nPra isso, vou precisar te fazer algumas perguntas rápidas, para poder te colocar no lugar certo aqui nesse servidor.\n\nMas olha só, não se preocupa se errar, depois eu explico como ajeitar, ok?\n\nAgora vamos às perguntas!',
        'footer': {
            'text': 'by Ranieri Valença'
        }
    }).setTimestamp()

    await delayedSend(ch, welcomeEmbed)
    await delayedSend(
        ch,
        new Discord.MessageEmbed({
            'title': 'Primeiro, preciso saber o seu nome',
            'description': '(não é o apelido, hein?)'
        })
    )
    await timedInteraction(
        ch, user,
        m => {
            realName = m.content
            return true
        },
        async () => {
            await delayedSend(
                ch,
                new Discord.MessageEmbed({
                    'title': `Oi, ${user.username}... espero que você não esteja me ignorando :cry:`,
                    'description': 'Preciso saber teu nome e outras informações pra poder te dar as autorizações necessárias aqui aqui no servidor... Diz teu nome aí por favor ;)'
                })
            )
        }
    )
    return realName
}

const getCourseAndSemester = async (ch, user) => {
    await delayedSend(
        ch,
        new Discord.MessageEmbed({
            'title': 'Muito obrigado :heart_eyes: Agora me responde, vc estuda no **IFPE - Campus Igarassu**?',
            'fields': [
                {
                    'name': 'sim',
                    'value': 'digite `s` ou `sim`',
                    'inline': true
                },
                {
                    'name': 'não',
                    'value': 'digite `n` ou `não`',
                    'inline': true
                }
            ]
        })
    )

    await timedInteraction(
        ch, user,
        m => {
            m = m.content.toLowerCase().replace(/[ãâáàä]/, 'a').trim()
            if (m == 'n' || m == 'nao') {
                course = null
                return true
            }
            if (m == 's' || m == 'sim') {
                course = '?'
                return true
            }
            return false
        },
        async expired => {
            await delayedSend(
                ch,
                new Discord.MessageEmbed({
                    'title': expired ? `Oi, ${realName}... espero que você não esteja me ignorando :cry:` : 'Eita, não entendi tua resposta... :sweat:',
                    'description': 'Eu preciso saber se vc estuda no **Campus Igarassu** do **IFPE** :pleading_face:',
                    'fields': [
                        {
                            'name': 'sim',
                            'value': 'digite `s` ou `sim`',
                            'inline': true
                        },
                        {
                            'name': 'não',
                            'value': 'digite `n` ou `não`',
                            'inline': true
                        }
                    ]
                })
            )
        }
    )


    if (course != '?') {
        await delayedSend(
            ch,
            // `Eita, que legal. Seja bem vindx mais uma vez, espero que considere estudar com a gente em breve =)`
            new Discord.MessageEmbed({
                'title': `Aee!! Valeu e seja bem vindx mais uma vez, ${realName}`,
                'description': 'Espero que considere estudar com a gente em breve :blush:'
            })
        )
        return [null, null]
    }

    await delayedSend(
        ch,
        new Discord.MessageEmbed({
            'title': 'Aee!! Quase acabando',
            'description': 'Qual teu curso?',
            'fields': [
                {
                    'name': 'Técnico em Informática para Internet',
                    'value': 'digite `ipi`',
                    'inline': true
                },
                {
                    'name': 'Tecnológico em Sistemas para Internet',
                    'value': 'digite `tsi`',
                    'inline': true
                },
                {
                    'name': 'Outro curso',
                    'value': 'digite `0`',
                    'inline': true
                }
            ]
        })
    )

    await timedInteraction(
        ch, user,
        async m => {
            m = m.content.toLowerCase().trim()
            if (!['ipi', 'tsi', /*'log', 'qua', 'adm', 'eja',*/ '0'].includes(m)) {
                return false
            }
            course = m.toUpperCase()
            if (course == '0') {
                course = null
            }
            return true
        },
        async expired => {
            await delayedSend(
                ch,
                new Discord.MessageEmbed({
                    'title': expired ? `Oi, ${realName}... espero que você não esteja me ignorando :cry:` : 'Eita, não entendi tua resposta... :sweat:',
                    'description': 'Preciso saber qual teu curso no Campus pra continuar esse processo :pleading_face:',
                    'fields': [
                        {
                            'name': 'Técnico em Informática para Internet',
                            'value': 'digite `ipi`',
                            'inline': true
                        },
                        {
                            'name': 'Tecnológico em Sistemas para Internet',
                            'value': 'digite `tsi`',
                            'inline': true
                        },
                        {
                            'name': 'Outro curso',
                            'value': 'digite `0`',
                            'inline': true
                        }
                    ]
                })
            )
        }
    )

    if (course == null) {
        return [null, null]
    }

    await delayedSend(
        ch,
        new Discord.MessageEmbed({
            'title': ':partying_face: Última perguntaa!!!',
            'description': 'Qual o ano/semestre que vc ingressou no curso? Digita o `ano.semestre`, tipo assim:',
            'fields': [
                {'name': 'Segundo semestre (segunda entrada) de 2020', 'value': 'digita `2020.2`', 'inline': true},
                {'name': 'Primeiro semestre de 2020', 'value': 'digita `2020.1`', 'inline': true},
                {'name': 'Segundo semestre de 2019', 'value': 'digita `2019.2`', 'inline': true},
                {'name': '...', 'value': 'digita `ANO.ENTRADA`', 'inline': true},
            ]
        })
    )
    await timedInteraction(
        ch, user,
        m => {
            if (!m.content.match(/20[12][0-9]\.[12]/))
                return false
            semester = m.content
            return true
        },
        async expired => {
            await delayedSend(
                ch,
                new Discord.MessageEmbed({
                    'title': expired ? `Oi, ${realName}... espero que você não esteja me ignorando :cry:` : 'Eita, não entendi tua resposta... :sweat:',
                    'description': 'Preciso saber o ano e semestre que vc ingressou no curso no formato `ano.semestre`, tipo assim:',
                    'fields': [
                        {'name': 'Segundo semestre (segunda entrada) de 2020', 'value': 'digita `2020.2`', 'inline': true},
                        {'name': 'Primeiro semestre de 2020', 'value': 'digita `2020.1`', 'inline': true},
                        {'name': 'Segundo semestre de 2019', 'value': 'digita `2019.2`', 'inline': true},
                        {'name': 'Primeiro semestre de 2019', 'value': 'digita `2019.1`', 'inline': true},
                        {'name': 'Segundo semestre de 2018', 'value': 'digita `2018.2`', 'inline': true},
                        {'name': '...', 'value': 'digita `ANO.ENTRADA`', 'inline': true},
                    ]
                })
            )
        }
    )

}


module.exports = (user, guild) => {
    user.createDM().then(async ch => {

        await welcomeAndGetName(ch, user)

        await getCourseAndSemester(ch, user)

        console.log([realName, course, semester])
        let member = guild.members.resolve(user.id)
        let course_semester = `${course} ${semester}`
        if (course == null) {
            course_semester = 'EXTERNO'
        }
        member.setNickname(`${course_semester} - ${realName}`)
        delayedSend(
            ch,
            new Discord.MessageEmbed({
                'author': {'name': 'Tudo certo!'},
                'title': realName,
                'fields': [
                    {
                        'name': 'Curso',
                        'value': course,
                        'inline': true
                    },
                    {
                        'name': 'Semestre de ingresso',
                        'value': semester,
                        'inline': true
                    }
                ],
                'footer': {
                    'text': 'Se precisar de ajuda, digite `!ajuda`. Se precisar recomeçar esse processo de configuração, digite `!welcome`'
                }
            })
        )
    })
}