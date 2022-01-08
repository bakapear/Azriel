/* global bot */
let dp = require('despair')
let { util } = require('../mod')

let words = []
let types = ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING']
let BLACKLIST_REGEX = /nigg?[aeoi]s?/i

module.exports = {
  randomPresence () {
    setInterval(async () => {
      if (!words.length) words = await fetchWords()
      bot.user.setPresence({ activity: { name: util.limit(words.shift(), 25), type: util.randomItem(types), url: 'https://twitch.tv/btssmash' } })
    }, 654321)
  }
}

async function fetchWords () {
  let body = await dp('https://api.urbandictionary.com/v0/random').json()
  return body.list.map(x => x.word).filter(x => !BLACKLIST_REGEX.test(x))
}
