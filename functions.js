const {CHARS_PER_SECOND, INITIAL_WAIT_TIME} = require('./global.config.json')


const delayedSend = (textBasedChannel, message, time) => {
    time = time || (message.length / CHARS_PER_SECOND)
    time *= 1000

    textBasedChannel.startTyping()
    return new Promise((res, rej) => {
        setTimeout(() => {
            textBasedChannel.send(message)
            textBasedChannel.stopTyping()
            console.log(`SENT: ${message}`)
            res(message)
        }, time)
    })
}



const getMessageFrom = (textBasedChannel, user, time) => {
    let options = {max: 1}
    if (typeof time == 'number')
        options['time'] = time
    console.log(options)
    let collector = textBasedChannel.createMessageCollector(m => m.author.id == user.id, options)
    return new Promise((res, rej) => {
        collector.on('collect', m => {
            console.log(`COLLECTED: ${m.content}`)
            res(m)
        }).on('end', () => {
            console.log(`TIMEOUT`)
            rej()
        })
    })
}



const timedInteraction = async (ch, user, messageCollected, timedOutOrError) => {
    let validAnswer = false
    let waitTime = INITIAL_WAIT_TIME
    while (await !validAnswer) {
        let expired = false
        await getMessageFrom(ch, user, waitTime).then(async m => {
            validAnswer = await messageCollected(m)
        }).catch(() => {
            waitTime *= 2
            expired = true
        })
        if (await !validAnswer) {
            console.log('invalid answer')
            timedOutOrError(expired)
        }
    }
}

module.exports = {
    delayedSend: delayedSend,
    getMessageFrom: getMessageFrom,
    timedInteraction: timedInteraction
}
