// https://stackoverflow.com/questions/16631064/declare-multiple-module-exports-in-node-js
const {
    delayedSend,
    timedInteraction
} = require('./functions')


let realName, course, semester


const welcomeAndGetName = async (ch, user) => {
    // https://dev.to/aumayeung/where-s-the-sleep-function-in-javascript-bk8
    let messages = [
        `Olá, __${user.username}__, seja bem vindo ao servidor do Professor Ranieri.`,
        'Eu sou o **RaVaC **, um dos bots do professor, e minha função aqui é organizar a casa.\nPra isso, vou precisar te fazer algumas perguntas rápidas, para poder te deixar no lugar certo aqui nesse servidor, Mas não se preocupa se errar, depois eu explico como mudar algo, ok?',
        'Vamos lá, Primeiro eu preciso saber teu nome (de verdade, não o apelido), digita aí.'
    ]
    for await (let m of messages) {
        await delayedSend(ch, m)
    }
    await timedInteraction(
        ch, user,
        m => {
            realName = m.content
            return true
        },
        async () => {
            await delayedSend(ch, `Oi, ${user.username}, você está por aí? Preciso saber teu nome e outras informações pra poder te dar as autorizações necessárias aqui aqui no servidor... Diz teu nome aí por favor ;)`)
        }
    )
    return realName
}

const getCourseAndSemester = async (ch, user) => {
    await delayedSend(
        ch,
        [
            'Agora eu preciso saber se vc estuda no **Campus Igarassu** do **IFPE**...',
            'Você pode responder',
            '- `s` ou `sim`',
            '- `n` ou `não`',
        ].join('\n')
    )

    await timedInteraction(
        ch, user,
        async m => {
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
                [
                    expired ? `${realName}, você ainda está aí?` : 'Eita, não entendi tua resposta...',
                    'Eu preciso saber se vc estuda no **Campus Igarassu** do **IFPE**,',
                    'responde com __`sim`__ ou __`nao`__ que facilita o nosso entendimento ;)',
                ].join('\n')
            )
        }
    )


    if (course != '?') {
        await delayedSend(ch, `Eita, que legal. Seja bem vindx mais uma vez, espero que considere estudar com a gente em breve =)`)
        return [null, null]
    }

    await delayedSend(ch,
        [
            'Massa, já estamos quase acabando. Só mais duas perguntinhas.',
            '1. Qual teu curso?',
            '- `IPI` se for do curso Técnico em Informática para Internet',
            '- `TSI` se for do curso Tecnológico em Sistemas para Internet',
            '- `LOG` se for do curso Técnico em Logística',
            '- `QUA` se for do curso Tecnológico em Gestão da Qualidade',
            '- `ADM` se for do curso de Bacharelado em Administração',
            '- `EJA` se for de algum curso EJA',
            '- `0` se você não faz nenhum dos cursos acima no IFPE',
        ].join('\n')
    )

    await timedInteraction(
        ch, user,
        async m => {
            m = m.content.toLowerCase().trim()
            if (!['ipi', 'tsi', 'log', 'qua', 'adm', 'eja', '0'].includes(m)) {
                return false
            }
            course = m.toUpperCase()
            if (course == '0') {
                course = null
            }
            return true
        },
        async expired => {
            await delayedSend(ch,
                [
                    expired ? `${realName}, você ainda está aí?` : 'Eita, não entendi tua resposta =(',
                    'Preciso saber qual teu curso no Campus...',
                    '- `IPI` se for do curso Técnico em Informática para Internet',
                    '- `TSI` se for do curso Tecnológico em Sistemas para Internet',
                    '- `LOG` se for do curso Técnico em Logística',
                    '- `QUA` se for do curso Tecnológico em Gestão da Qualidade',
                    '- `ADM` se for do curso de Bacharelado em Administração',
                    '- `EJA` se for de algum curso EJA',
                    '- `0` se você não faz nenhum dos cursos acima no IFPE'
                ].join('\n')
            )
        }
    )

    if (course == null) {
        return [null, null]
    }

    await delayedSend(ch, 'E qual o ano/semestre que vc entrou no curso? (Escreve no formato ANO.SEMESTRE, tipo `2020.2`)')
    await timedInteraction(
        ch, user,
        m => {
            if (!m.content.match(/[0-9]{4}\.[012]/))
                return false
            semester = m.content
            return true
        },
        async expired => {
            await delayedSend(
                ch,
                [
                    expired ? `${realName}, você ainda está aí?` : 'Eita, não entendi tua resposta =(',
                    `Preciso saber o ano e semestre que vc entrou no curso de ${course}, no formato **ANO.SEMESTRE**.`,
                    'Por exemplo, se vc começou seu curso no segund semestre de 2019, vai escrever `2019.2`; se foi no primeiro semetre (ou primeira entrada) de 2020, vai ser `2020.1`, e assim vai.'
                ].join('\n')
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
    })
}