/* global bot */
let { util } = require('../../mod')

let channel = bot.channels.cache.get('1197976655755497492')
if (channel) setTimer(() => util.getToTime(20))

function setTimer (fn) {
  setTimeout(async () => {
    try {
      channel.send({ content: '<@359305054853005314>, https://i.wuu.sh/_wrmQmxdqVCC.mp4' })
      setTimer(fn)
    } catch (e) { console.error(e) }
  }, fn())
}