let util = require('../util')
let hy = require('honesty')
let dp = require('despair')

module.exports = {
  name: 'yandex',
  aliases: ['yx'],
  description: 'Reverse image searches an image on yandex.',
  permissions: [],
  args: 1,
  usage: '<url> (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(reverseImageYandex, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    if (res.isList) {
      return util.showEmbedList(msg.channel, res.items, res.offset, items => {
        return {
          title: 'Listing Yandex reverse image search results',
          description: items.map(x => `[${x.title}](${x.url})`).join('\n')
        }
      })
    }
    let item = res.item
    return util.showEmbed(msg.channel, {
      title: item.title,
      url: item.url,
      description: item.description,
      image: { url: item.img }
    })
  }
}

async function reverseImageYandex (url) {
  let { body } = await dp('https://yandex.com/images/search', {
    query: { url, rpt: 'imagelike' }
  })
  let $ = hy(body)
  let res = []
  let images = $('.serp-item')
  for (let i = 0; i < images.length; i++) {
    let data = JSON.parse(images[i].attribs['data-bem'])['serp-item']
    res.push({
      title: data.snippet.title,
      description: data.snippet.text,
      url: data.snippet.url,
      img: data.preview[0].url
    })
  }
  return res
}
