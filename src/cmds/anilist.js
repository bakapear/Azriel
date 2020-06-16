let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'anilist',
  aliases: ['ani'],
  description: 'Searches for an anime on AniList.',
  permissions: [],
  args: 1,
  usage: '<query> (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getAnime, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    if (res.isList) {
      return util.showEmbedList(msg.channel, res.items, res.offset, items => {
        return {
          title: `Listing animes matching '${res.search}'`,
          description: items.map(x => x.siteUrl ? `[${x.title.romaji}](${x.siteUrl})` : x.title.romaji).join('\n')
        }
      })
    }
    let item = res.item
    let desc = item.description.replace(/<\/?br\/?>/g, '\n').replace(/<\/?b>/g, '**').replace(/<\/?i>/g, '_').replace(/\n\n/g, '\n')
    if (desc.length > 1000) desc = desc.substr(0, 1000) + '...'
    let date = new Date()
    date.setFullYear(item.startDate.year, item.startDate.month, item.startDate.day)
    let size = item.type === 'MANGA' ? `${item.chapters} Chapters ${item.volumes} Volumes` : `${item.episodes} Episodes`
    if (size.indexOf('null') >= 0) size = 'ongoing'
    return util.showEmbed(msg.channel, {
      title: item.title.romaji,
      url: item.siteUrl,
      description: desc,
      thumbnail: {
        url: item.coverImage.large
      },
      timestamp: date.toLocaleDateString(),
      footer: {
        text: `${item.meanScore}/100 | ${size} | ${item.type}`
      }
    })
  }
}

async function getAnime (search) {
  let body = await dp.post('https://graphql.anilist.co', {
    data: {
      query: 'query ($id: Int, $page: Int, $perPage: Int, $search: String) { Page(page: $page, perPage: $perPage) { media(id: $id, search: $search) { id title { romaji } description startDate { year month day } type episodes chapters volumes coverImage { large } meanScore siteUrl } } }',
      variables: { search: search, perPage: 10 }
    },
    type: 'json'
  }).json()
  return body.data.Page.media
}
