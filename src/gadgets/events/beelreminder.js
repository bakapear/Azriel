/* global bot */

let channel = bot.channels.cache.get('402461425743822879')

function getToTime (h = 0, m = 0, s = 0, ms = 0) {
  let now = new Date()
  let later = new Date()
  later.setDate(now.getDate())
  later.setHours(h)
  later.setMinutes(m)
  later.setSeconds(s)
  later.setMilliseconds(ms)
  let time = later - now
  if (time <= 0) time += 86400000
  return time
}

function setTimer () {
  setTimeout(() => {
    channel.send(`Don't forget to claim your shit, <@284425943034888204>!`)
    setTimer()
  }, getToTime(14))
}

if (channel) setTimer()
