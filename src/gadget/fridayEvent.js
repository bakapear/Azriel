/* global bot */

let channel = bot.channels.cache.get('402461425743822879')
let days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

function getTimeToDay (day, h = 0, m = 0, s = 0, ms = 0) {
  let d = days.indexOf(day.toLowerCase()) + 1
  if (d < 1) throw new Error(`Invalid day: '${day}'`)
  let now = new Date()
  let later = new Date()
  later.setDate(now.getDate() + (d + 7 - now.getDay()) % 7)
  later.setHours(h)
  later.setMinutes(m)
  later.setSeconds(s)
  later.setMilliseconds(ms)
  let time = later - now
  if (time <= 0) time += 604800000
  return time
}

function setTimer () {
  setTimeout(() => {
    channel.send({ files: [{ attachment: 'https://uh.s-ul.eu/ACudWOPh.mp4', name: 'friday-night.mp4' }] })
    setTimer()
  }, getTimeToDay('Friday', 21))
}

setTimer()
