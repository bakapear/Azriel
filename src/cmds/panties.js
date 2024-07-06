let { util } = require('../mod')
let dp = require('despair')

module.exports = {
  name: 'panties',
  description: 'Get a random Gelbooru comment',
  async exec (msg, cmd) {
    let res = await getComments()
    if (!res.length) return msg.channel.send('Nothing found!')

    let item = util.randomItem(res)

    return msg.channel.send({
      embed: {
        description: item.body,
        timestamp: item.created_at,
        footer: { text: 'by ' + item.creator }
      }
    })
  }
}

async function getComments () {
  let body = await dp('https://api.rule34.xxx', {
    query: {
      page: 'dapi',
      s: 'comment',
      q: 'index'
    }
  }).text()
  let matches = body.match(/".*?"/gs).map(x => x.substr(1, x.length - 2))
  let res = []
  for (let i = 3; i < matches.length; i++) {
    res.push({
      created_at: matches[i],
      post_id: matches[++i],
      body: util.decodeEntities(matches[++i]),
      creator: matches[++i],
      id: matches[++i],
      creator_id: matches[++i]
    })
  }
  return res
}
