/* global bot */
let dp = require('despair')
let url = 'https://store.steampowered.com/app/669270'
let match = x => x.indexOf('RequestPlaytestAccess') >= 0

let channel = bot.channels.cache.get('914552006008512582')
if (channel) {
  let loop = setInterval(async () => {
    try {
      let body = await dp(url).text().catch(e => '')
      if (match(body)) {
        channel.send({ content: 'GO WILD @everyone: ' + (url || 'woof') })
        clearInterval(loop)
      }
    } catch (e) {}
  }, 60000)
}
