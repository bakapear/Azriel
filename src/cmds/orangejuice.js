let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'orangejuice',
  aliases: ['oj'],
  description: `Gets a card or character from 100% Orange Juice.`,
  permissions: [],
  args: 0,
  usage: '(query) (offset)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getCards, cmd)
    if (!res) return msg.channel.send('Nothing found!')
    let img = await util.attachImages([res.url])
    msg.channel.send({ files: img })
  }
}

async function getCards (query) {
  let data = await getData()
  query = query.toLowerCase()
  return data.filter(x => x.name.toLowerCase().indexOf(query) >= 0)
}

async function getData () {
  let url = 'https://raw.githubusercontent.com/bakapear/JuiceData/master/data/'
  let cards = await dp(url + 'cards.json').json()
  let chars = await dp(url + 'chars.json').json()
  return [...cards, ...chars]
}
