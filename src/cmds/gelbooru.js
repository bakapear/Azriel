let dp = require('despair')
let { util } = require('../mod')

module.exports = [
  {
    name: 'gelbooru',
    aliases: ['gel'],
    description: 'Get a naughty image from Gelbooru',
    async exec (msg, cmd) {
      let args = cmd.args.map(x => {
        if (x === 's' || x === 'safe') x = 'rating:safe'
        if (x === 'q' || x === 'questionable') x = 'rating:questionable'
        if (x === 'e' || x === 'explicit') x = 'rating:explicit'
        if (x === 'r' || x === 'random') x = 'sort:random'
        return x
      })
      if (!args.length || cmd.random) args.push('sort:random')

      let item = await getGelbooruImage(args)
      if (!item) return msg.channel.send('Nothing found!')

      if (item.file_url.match(/\.(gif|webm|mp4)$/)) {
        return msg.channel.send(item.file_url)
      }

      let sample = item.file_url.replace('images', 'samples').replace('.png', '.jpg')
      let index = sample.lastIndexOf('/')
      sample = sample.substr(0, index + 1) + 'sample_' + sample.substr(index + 1)

      return util.sendImage(msg, item.file_url, sample)
    }
  },
  {
    name: 'marisa',
    aliases: ['kirisame'],
    description: 'Display marisa kirisame',
    async exec (msg, cmd) {
      let item = await getGelbooruImage(['kirisame_marisa', '1girl', 'rating:safe', 'sort:random'])
      if (!item) return msg.channel.send('Nothing found!')

      if (item.file_url.match(/\.(gif|webm|mp4)$/)) {
        return msg.channel.send(item.file_url)
      }

      let sample = item.file_url.replace('images', 'samples').replace('.png', '.jpg')
      let index = sample.lastIndexOf('/')
      sample = sample.substr(0, index + 1) + 'sample_' + sample.substr(index + 1)

      return util.sendImage(msg, item.file_url, sample)
    }
  }
]

let BLACKLIST = ['scat', 'guro', 'furry', 'diaper', 'twerking']

async function getGelbooruImage (args) {
  try {
    let res = await dp('https://gelbooru.com/index.php', {
      query: {
        tags: [...BLACKLIST.map(x => `-${x}`), ...args].join(' '),
        page: 'dapi',
        s: 'post',
        q: 'index',
        limit: 1,
        json: 1
      }
    }).json()
    return res[0]
  } catch (e) { return null }
}
