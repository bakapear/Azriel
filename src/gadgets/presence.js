/* global bot */

let dp = require('despair')
let util = require('../util')

let words = []
let types = ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING']

setInterval(async () => {
  if (!words.length) words = (await dp('https://api.urbandictionary.com/v0/random').json()).list.map(x => x.word)
  bot.user.setPresence({ activity: { name: words.shift().substring(0, 25), type: util.randomItem(types), url: 'https://twitch.tv/btssmash' } })
}, 654321)
