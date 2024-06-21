let dp = require('despair')
let { util } = require('../mod')

module.exports = [
  {
    name: 'gelbooru',
    aliases: ['gel'],
    description: 'Get a naughty image from Gelbooru!',
    usage: '(query)',
    async exec (msg, cmd) {
      let args = cmd.args.map(x => {
        if (x === 's' || x === 'sensitive') x = 'rating:sensitive'
        if (x === 'g' || x === 'general') x = 'rating:general'
        if (x === 'r' || x === 'random') x = 'sort:random'
        return x
      })
      if (!args.length || cmd.random) args.push('sort:random')

      let item = await getGelbooruImage(args)
      if (!item) return msg.channel.send('Nothing found!')

      if (item.file_url.match(/\.(gif|webm|mp4)$/)) return msg.channel.send(`${item.file_url}`)

      let sample = item.file_url.replace('images', 'samples').replace('.png', '.jpg')
      let index = sample.lastIndexOf('/')
      sample = sample.substr(0, index + 1) + 'sample_' + sample.substr(index + 1)

      return util.sendImage(msg, item.file_url, sample)
    }
  },
  {
    name: 'e621',
    aliases: ['e'],
    description: 'Get a naughty image from e621!',
    usage: '(query)',
    async exec (msg, cmd) {
      let args = cmd.args.map(x => {
        if (x === 's' || x === 'safe') x = 'rating:safe'
        if (x === 'q' || x === 'questionable') x = 'rating:questionable'
        if (x === 'e' || x === 'explicit') x = 'rating:explicit'
        if (x === 'r' || x === 'random') x = 'order:random'
        return x
      })
      if (!args.length || cmd.random) args.push('order:random')

      let item = await getE621Image(args)
      if (!item) return msg.channel.send('Nothing found!')

      if (item.file.url.match(/\.(gif|webm|mp4)$/)) return msg.channel.send(`${item.file.url}`)

      return util.sendImage(msg, item.file.url, item.sample.url)
    }
  },
  {
    name: 'konachan',
    aliases: ['kona'],
    description: 'Get a cute image from Konachan',
    usage: '(query)',
    async exec (msg, cmd) {
      let args = cmd.args.map(x => {
        if (x === 's' || x === 'safe') x = 'rating:safe'
        if (x === 'q' || x === 'questionable') x = 'rating:questionable'
        if (x === 'e' || x === 'explicit') x = 'rating:explicit'
        if (x === 'r' || x === 'random') x = 'order:random'
        return x
      })
      if (!args.length || cmd.random) args.push('order:random')

      let item = await getKonachanImage(args)
      if (!item) return msg.channel.send('Nothing found!')

      if (item.file_url.match(/\.(gif|webm|mp4)$/)) return msg.channel.send(item.file_url)

      return util.sendImage(msg, item.file_url, item.sample_url)
    }
  },
  {
    name: 'marisa',
    aliases: ['kirisame'],
    description: 'Display marisa kirisame',
    async exec (msg, cmd) {
      let item = await getGelbooruImage(['kirisame_marisa', '1girl', 'rating:general', 'sort:random'])
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

let BLACKLIST = ['loli', 'scat', 'guro', 'furry', 'diaper', 'twerking', 'rating:explicit']

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
    res = res.post
    return res[0]
  } catch (e) { return null }
}

async function getKonachanImage (args) {
  try {
    let res = await dp('https://konachan.net/post.json', {
      query: {
        tags: ['rating:safe', ...args].join(' '),
        limit: 50
      }
    }).json()
    // only up to 6 tags so we have to filter blacklist
    return res.filter(x => BLACKLIST.every(y => x.tags.indexOf(y) < 0) && x.rating === 's')[0]
  } catch (e) { return null }
}

async function getE621Image (args) {
  try {
    let res = await dp('https://e621.net/posts.json?limit=10', {
      headers: { 'User-Agent': 'doggo' },
      query: {
        tags: [...BLACKLIST.map(x => `-${x}`), ...args].join(' '),
        limit: 50
      }
    }).json()
    res.posts = res.posts.filter(x => x.file.url)
    return res.posts[0]
  } catch (e) { return null }
}
