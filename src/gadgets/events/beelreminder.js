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
    if (channel) {
      channel.send({
        content: '<@284425943034888204>',
        files: [{ attachment: 'https://uh.s-ul.eu/3lArisA7.mp4', name: 'beel-health-check.mp4' }]
      })
    }
    setTimer()
  }, getToTime(14))
}

if (channel) setTimer()
