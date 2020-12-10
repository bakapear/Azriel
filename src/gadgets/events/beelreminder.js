/* global bot */
let dp = require('despair')

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
  setTimeout(async () => {
    if (channel) {
      try {
        let url = await getKPOP()
        channel.send({
          content: '<@284425943034888204>, ' + (url[0] || 'woof')
        })
      } catch (e) { console.error(e) }
    }
    setTimer()
  }, getToTime(13))
}

if (channel) setTimer()

async function getKPOP (limit = 25) {
  let body = await dp('https://www.reddit.com/r/kpopfap/new.json', { query: { limit } }).json()
  body = body.data.children
  let res = []
  for (let i = 0; i < body.length; i++) {
    let item = body[i].data
    if (['reddit.com', 'i.redd.it', 'gfycat.com', 'i.imgur.com'].includes(item.domain)) {
      if (item.secure_media) {
        if (item.domain === 'gfycat.com') item = item.url + '.gif'
        else item = item.secure_media.oembed.thumbnail_url
      } else if (item.media_metadata) {
        let data = Object.values(item.media_metadata).find(x => x.status === 'valid')
        item = 'https://i.redd.it/' + data.id + '.' + data.m.split('/').pop()
      } else {
        item = item.url
      }
      res.push(item)
    }
  }
  return res
}
