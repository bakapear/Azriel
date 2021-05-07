let { util } = require('../mod')
let dp = require('despair')
let hy = require('honesty')

module.exports = {
  name: 'unusualwiki',
  aliases: ['uwa'],
  description: 'Get a random Unusual Wikipedia Article',
  exec: async (msg, cmd) => {
    let articles = await getArticles()
    let item = util.randomItem(articles)
    return msg.channel.send({
      embed: {
        title: item.name,
        url: 'https://en.wikipedia.org' + item.url,
        description: item.desc
      }
    })
  }
}

async function getArticles () {
  let body = await dp('https://en.wikipedia.org/wiki/Wikipedia:Unusual_articles').text()
  let $ = hy(body)
  let list = $('.wikitable tr')
  let res = []
  for (let i = 0; i < list.length; i++) {
    let item = $(list[i])
    let head = item.find('b>a')[0]
    let td = item.find('td')
    let desc = $(td[td.length === 3 ? 2 : 1]).text(true)
    if (!head) continue
    res.push({
      name: head.attribs.title,
      url: head.attribs.href,
      desc: desc
    })
  }
  return res
}
