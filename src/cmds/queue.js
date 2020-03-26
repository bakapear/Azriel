/* global MediaPlayer */
let util = require('../util')

module.exports = {
  name: 'queue',
  aliases: ['q'],
  description: 'Gets the current items in queue.',
  permissions: [],
  args: 0,
  usage: '(query) (poker)',
  exec: async (msg, cmd) => {
    if (!cmd.content) {
      cmd.str += ' !'
      cmd.content = '!'
      cmd.args = ['!']
    }
    let player = MediaPlayer(msg.guild.id)
    let res = await util.poker(async x => searchQueue(player, x), cmd)
    if (!res.item) return msg.channel.send('Nothing found!')
    if (!cmd.content || res.isList) {
      return util.showEmbedList(msg.channel, res.items, res.offset, items => {
        return {
          title: res.search ? `Showing items including '${res.search}' in Queue` : 'Showing items in Queue',
          description: items.map((x, i) => `${x.index + 1}. [${x.name}](${x.url}) ${x.time}`).join('\n')
        }
      })
    } else {
      let item = res.item
      return util.showEmbed(msg.channel, {
        title: `Showing Item at #${item.index + 1} in Queue`,
        url: item.url,
        thumbnail: { url: item.img },
        description: `\`${item.name}\``,
        footer: {
          text: item.author.user.tag + ' • ' + item.time,
          icon_url: item.author.user.avatarURL()
        }
      })
    }
  }
}

async function searchQueue (player, query) {
  let items = player.queue.slice()
  for (let i = 0; i < items.length; i++) items[i].index = i
  if (query) items = items.filter(x => x.name.toLowerCase().indexOf(query.toLowerCase()) >= 0)
  return items
}
