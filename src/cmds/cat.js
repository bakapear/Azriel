let dp = require('despair')
let util = require('../util')

module.exports = {
  name: 'cat',
  aliases: [],
  description: 'Displays a random cat image.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    let cat = await getCat()
    let img = await util.attachImages([cat.url])
    return msg.channel.send({ files: img })
  }
}

async function getCat () {
  let body = await dp('https://api.thecatapi.com/api/images/get', {
    query: {
      format: 'json'
    }
  }).json()
  return body[0]
}
