let { util } = require('../mod')
let dp = require('despair')
let hy = require('honesty')

module.exports = {
  name: 'yandex',
  aliases: ['yx'],
  description: 'Reverse image search an image on Yandex',
  args: 1,
  usage: '<url>',
  async exec (msg, cmd) {
    let res = await reverseImageYandex(cmd.content)
    if (!res.length) return msg.channel.send('Nothing found!')

    let item = cmd.random ? util.randomItem(res) : res[0]

    return msg.channel.send({
      embed: {
        title: item.title,
        url: item.url,
        description: item.description,
        image: { url: item.img }
      }
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
    try {
      let data = JSON.parse(images[i].attribs['data-bem'])['serp-item']
      res.push({
        title: data.snippet.title,
        description: data.snippet.text,
        url: data.snippet.url,
        img: data.preview[0].url
      })
    } catch (e) { continue }
  }
  return res
}
