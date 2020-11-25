// https://stackoverflow.com/questions/16631064/declare-multiple-module-exports-in-node-js
const {
    delayedSend,
    timedInteraction
} = require('./functions')

const {studentRoleId} = require('./.config.json')
const interactions = require('./interactions.js')

const Discord = require('discord.js')

const sendFactory = ch => {
    return msg => {
        if (typeof msg == 'object') {
            msg = new Discord.MessageEmbed(msg)
        }
        return delayedSend(ch, msg)
    }
}

const getInputFactory = (ch, user, raw = false) => {
    return async (inputProcessing, validation, expiredFn, returnRawInput = false) => {
        let answer = null
        await timedInteraction(
            ch,
            user,
            message => {
                message = raw ? message : message.content
                answer = message

                if (inputProcessing) {
                    answer = returnRawInput ? answer : inputProcessing(answer)
                    message = inputProcessing(message)
                }
                console.log(answer, message)

                return validation ? validation(message) : () => true
            },
            expired => {
                return expiredFn(expired)
            }
        )
        return answer
    }
}


const welcomeAndGetName = async (ch, user) => {
    let send = sendFactory(ch)
    let get = getInputFactory(ch, user)

    await send(interactions['welcome'](user.username))
    await send(interactions['askName'])

    let realName = await get(
        null, null,
        expired => send(interactions['askName.error'](user.username))
    )

    return realName
}

const getCourseAndSemester = async (ch, user, realName) => {
    let course, semester

    let send = sendFactory(ch)
    let get = getInputFactory(ch, user)

    await send(interactions['isStudent'])

    let isStudent = await get(
        message => message.toLowerCase().replace(/[ãâáàä]/, 'a').trim(),
        message => ['n', 'nao', 's', 'sim'].includes(message),
        expired => send(interactions['isStudent.error'](expired, realName))
    )
    console.log(isStudent)

    if (['n', 'nao'].includes(isStudent)) {
        await send({
            'title': `Aee!! Valeu e seja bem vindx mais uma vez, ${realName}`,
            'description': 'Espero que considere estudar com a gente em breve :blush:'
        })
        return [null, null]
    }

    await send(interactions['askCourse'])

    let answerCourse = await get(
        message => message.toLowerCase().trim(),
        message => ['ipi', 'tsi', '0'].includes(message),
        expired => send(interactions['askCourse.error'](expired, realName))
    )
    course = answerCourse == '0' ? null : answerCourse.toUpperCase()

    if (course == null) {
        return [null, null]
    }

    await send(interactions['askSemester'])
    semester = await get(
        null,
        message => message.match(/20[12][0-9]\.[12]/),
        expired => send(interactions['askSemester.error'](expired, realName))
    )

    return [course, semester]

}


module.exports = (user, guild) => {
    user.createDM().then(async ch => {
        // console.log(guild.roles.resolve(studentRoleId))

        let realName = await welcomeAndGetName(ch, user)
        if (!realName)
            return

        let [course, semester] = await getCourseAndSemester(ch, user, realName)

        console.log([realName, course, semester])

        let course_semester = `${course} ${semester}`
        if (!course) {
            course_semester = 'EXTERNO'
        }

        let member = guild.members.resolve(user.id)
        member.setNickname(`${course_semester} - ${realName}`)
        let studentRole = guild.roles.cache.find(r => r.name == 'Student')
        if (studentRole)
            member.roles.add(studentRole).catch(() => {

            })
        let finalMessageFields = []
        if (course) {
            finalMessageFields = [
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
            ]
        }
        delayedSend(
            ch,
            new Discord.MessageEmbed({
                'author': {'name': 'Tudo certo!'},
                'title': realName,
                'fields': finalMessageFields,
                'footer': {
                    'text': 'Se precisar de ajuda, digite `!ajuda`. Se precisar recomeçar esse processo de configuração, digite `!welcome`'
                }
            })
        )
    })
}