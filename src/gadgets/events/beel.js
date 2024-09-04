/* global bot */
let dp = require('despair')
let { util } = require('../../mod')

let channel = bot.channels.cache.get('402461425743822879')
if (channel) setTimer(() => util.getToTime(13))

function setTimer (fn) {
  setTimeout(async () => {
    try {
      let urls = await getKPOP()
      channel.send({ content: '<@284425943034888204>, ' + (urls[0] || 'woof') })
      setTimer(fn)
    } catch (e) { console.error(e) }
  }, fn())
}

getKPOP()

async function getKPOP () {
  let body = await dp('https://kpfarchive.com/api/posts', {
    headers: { 'user-agent': 'discord bot azriel v2', accept: '*' }
  }).json().catch(e => null)

  if (!body) return []

  let res = []
  for (let i = 0; i < body.length; i++) {
    let item = body[i]
    if (!item.url.includes('/gallery/')) {
      res.push(item.url)
    }
  }
  return res
}
