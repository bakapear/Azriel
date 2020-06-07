let dp = require('despair')
let util = require('../util')

module.exports = {
  name: 'marisa',
  aliases: ['kirisame'],
  description: 'Displays marisa kirisame for ahmad.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    let posts = await getPosts('kirisame_marisa rating:safe 1girl')
    let item = util.randomItem(posts)
    let img = await util.attachImages([item.file_url])
    return msg.channel.send({ files: img })
  }
}

async function getPosts (query) {
  try {
    let res = await dp('https://gelbooru.com/index.php', {
      query: {
        tags: query,
        page: 'dapi',
        s: 'post',
        q: 'index',
        limit: 500,
        json: 1
      }
    }).json()
    return res
  } catch (e) { return [] }
}
