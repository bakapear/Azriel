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
    return msg.channel.send({ files: img })
  }
}

async function getVelvets (member) {
  let data = require('../data/velvet.json')
  data = data[members.includes(member) ? member : util.randomItem(members)]
  return data
}
