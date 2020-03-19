let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'danrep',
  aliases: [],
  description: `Gets a comment on Danbooru.`,
  permissions: [],
  args: 0,
  usage: '(query) (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getComments, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    let item = res.item
    util.showEmbed(msg.channel, {
      description: item.body,
      timestamp: item.created_at,
      footer: { text: 'by ' + item.creator_id }
    })
  }
}

async function getComments (query) {
  let body = await dp('https://danbooru.donmai.us/comments', {
    query: {
      format: 'json',
      group_by: 'comment',
      limit: 250,
      'search[body_matches]': query
    }
  }).json()
  return body
}
