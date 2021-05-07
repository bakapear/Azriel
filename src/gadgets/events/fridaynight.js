/* global bot */
let { util } = require('../../mod')

let channel = bot.channels.cache.get('402461425743822879')
if (channel) setTimer(util.getTimeToDay('Friday', 21))

function setTimer (ms) {
  setTimeout(async () => {
    try {
      channel.send({ files: [{ attachment: 'https://uh.s-ul.eu/ACudWOPh.mp4', name: 'friday-night.mp4' }] })
      setTimer(ms)
    } catch (e) { console.error(e) }
  }, ms)
}
