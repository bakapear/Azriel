let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'danrep',
  aliases: [],
  description: `Gets a comment on Danbooru.`,
  permissions: [],
  args: 0,
  usage: '(query) (offset)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getComments, cmd)
    if (!res) return msg.channel.send('Nothing found!')
    msg.channel.send({
      embed: {
        description: res.body,
        timestamp: res.created_at,
        footer: {
          text: 'by ' + res.creator_id
        }
      }
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
