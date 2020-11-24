const {CHARS_PER_SECOND, INITIAL_WAIT_TIME} = require('./global.config.json')


const wait = ms => new Promise(res => setTimeout(res, ms))

const delayedSend = async (textBasedChannel, message, time) => {
    time = time || (message.length / CHARS_PER_SECOND)
    console.log(message.length, time)
    time *= 1000

    textBasedChannel.startTyping()
    await wait(time)
    textBasedChannel.stopTyping()

    return textBasedChannel.send(message).catch(() => {
        console.log("error")
    })

}



const getMessageFrom = (textBasedChannel, user, time) => {
    let options = {max: 1}
    if (typeof time == 'number')
        options['time'] = time
    console.log(`[DEBUG] waiting interaction from ${user.username} for ${time}ms`)
    let collector = textBasedChannel.createMessageCollector(m => m.author.id == user.id, options)
    return new Promise((res, rej) => {
        collector.on('collect', m => {
            console.log(`[DEBUG] collected from ${user.username}: ${m.content}`)
            res(m)
        }).on('end', () => {
            console.log(`[DEBUG] ${user.username}: timed out`)
            rej()
        })
    })
}



const timedInteraction = async (ch, user, messageCollected, timedOutOrError) => {
    let validAnswer = false
    let waitTime = INITIAL_WAIT_TIME
    let halt = false
    while (await !validAnswer && !halt) {
        let expired = false
        await getMessageFrom(ch, user, waitTime).then(async m => {
            validAnswer = await messageCollected(m)
        }).catch(() => {
            waitTime *= 2
            expired = true
        })
        if (await !validAnswer) {
            expired ? '' : console.log('INVALID ANSWER')
            await timedOutOrError(expired)
                .catch(e => {
                    console.log('erro')
                    halt = true
                })
        }
    }
}

module.exports = {
    delayedSend: delayedSend,
    getMessageFrom: getMessageFrom,
    timedInteraction: timedInteraction
}
