let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'panties',
  aliases: [],
  description: `Gets a random Gelbooru comment.`,
  permissions: [],
  args: 0,
  usage: '(poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getComments, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    let item = res.item
    util.showEmbed(msg.channel, {
      description: item.body,
      timestamp: item.created_at,
      footer: { text: 'by ' + item.creator }
    })
  }
}

async function getComments () {
  let { body } = await dp('https://gelbooru.com/index.php', {
    query: {
      page: 'dapi',
      s: 'comment',
      q: 'index'
    }
  })
  let matches = body.match(/".*?"/gs).map(x => x.substr(1, x.length - 2))
  let res = []
  for (let i = 3; i < matches.length; i++) {
    res.push({
      created_at: matches[i],
      post_id: matches[++i],
      body: matches[++i]
        .replace(/&amp;/g, '&')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&quot;/g, '"'),
      creator: matches[++i],
      id: matches[++i],
      creator_id: matches[++i]
    })
  }
  return res
}
