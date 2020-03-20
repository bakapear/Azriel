let dp = require('despair')
let util = require('../util')
let members = ['irene', 'wendy', 'seulgi', 'joy', 'yeri']

module.exports = {
  name: 'redvelvet',
  aliases: ['rv', 'velvet', ...members],
  description: 'Gets a Red Velvet member.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    let velvets = await getVelvets(cmd.name)
    let item = util.randomItem(velvets)
    let img = await util.attachImages([item])
    msg.channel.send({ files: img })
  }
}

let cache = null

async function getVelvets (member) {
  let data = await getData()
  data = data[members.includes(member) ? member : util.randomItem(members)]
  return data
}

async function getData () {
  if (!cache) {
    cache = await dp('https://raw.githubusercontent.com/bakapear/VelvetData/master/data.json').json()
  }
  return cache
}
