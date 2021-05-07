let { util } = require('../mod')
let dp = require('despair')

module.exports = {
  name: 'anilist',
  aliases: ['ani'],
  description: 'Search for an anime on AniList',
  args: 1,
  usage: '<query>',
  async exec (msg, cmd) {
    let res = await getAnime(cmd.content)

    let item = cmd.random ? util.randomItem(res) : res[0]

    let desc = (item.description || '').replace(/<\/?br\/?>/g, '\n').replace(/<\/?b>/g, '**').replace(/<\/?i>/g, '_').replace(/\n\n/g, '\n')
    let date = new Date()
    date.setFullYear(item.startDate.year, item.startDate.month, item.startDate.day)
    let size = item.type === 'MANGA' ? `${item.chapters} Chapters ${item.volumes} Volumes` : `${item.episodes} Episodes`
    if (size.indexOf('null') >= 0) size = 'ongoing'

    return msg.channel.send({
      embed: {
        title: item.title.romaji,
        url: item.siteUrl,
        description: util.limit(desc, 1000),
        image: {
          url: 'https://img.anili.st/media/' + item.id
        },
        timestamp: date.toLocaleDateString(),
        footer: {
          text: `${item.meanScore}/100 | ${size} | ${item.type}`
        }
      }
    })
  }
}

async function getAnime (search) {
  let body = await dp.post('https://graphql.anilist.co', {
    data: {
      query: 'query ($id: Int, $page: Int, $perPage: Int, $search: String) { Page(page: $page, perPage: $perPage) { media(id: $id, search: $search) { id title { romaji } description startDate { year month day } type episodes chapters volumes meanScore siteUrl } } }',
      variables: { search: search, perPage: 10 }
    },
    type: 'json'
  }).json()
  return body.data.Page.media
}
