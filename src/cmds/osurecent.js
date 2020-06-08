let util = require('../util')
let dp = require('despair')
let key = process.env.OSU

module.exports = {
  name: 'osurecent',
  aliases: ['osr'],
  description: 'Displays recent play of user.',
  permissions: [],
  args: 1,
  usage: '<user> (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getRecent, cmd)
    if (!res.items.length) return msg.channel.send('No recent plays found!')
    if (res.isList) {
      for (let i = 0; i < res.items.length; i++) {
        let map = await getBeatmap(res.items[i].beatmap_id)
        res.items[i].text = `[${res.items[i].rank}]: \`${map.title} - ${map.artist}\``
      }
      return util.showEmbedList(msg.channel, res.items, res.offset, items => {
        return {
          title: `Listing recent plays of '${res.search}'`,
          description: items.map(x => `${x.text}`).join('\n')
        }
      })
    }
    let item = res.item
    let map = await getBeatmap(item.beatmap_id)
    let rank = RANK[item.rank]
    item.accuracy = (50 * Number(item.count50) + 100 * Number(item.count100) + 300 * Number(item.count300)) / (300 * (Number(item.countmiss) + Number(item.count50) + Number(item.count100) + Number(item.count300)))
    return util.showEmbed(msg.channel, {
      title: `${map.title} - ${map.artist} [${Number(map.difficultyrating).toFixed(1)} ☆ ${map.version}]`,
      url: 'https://osu.ppy.sh/beatmaps/' + map.beatmap_id,
      description: [
        `**Accuracy** ${(item.accuracy * 100).toFixed(2)}%`,
        `**Combo** ${item.maxcombo}/${map.max_combo}\n`,
        `**300** ${item.count300}`,
        `**100** ${item.count100}`,
        `**50** ${item.count50}`,
        `**Miss** ${item.countmiss}`
      ].join(' '),
      timestamp: item.date,
      footer: { text: cmd.args[0] },
      thumbnail: { url: rank.img },
      color: rank.color
    })
  }
}

async function getRecent (user) {
  let body = await dp('https://osu.ppy.sh/api/get_user_recent', {
    query: { k: key, u: user, limit: 50 }
  }).json()
  return body
}

async function getBeatmap (id) {
  let body = await dp('https://osu.ppy.sh/api/get_beatmaps', {
    query: { k: key, b: id }
  }).json()
  return body[0]
}

let RANK = {
  F: { img: 'https://i.imgur.com/BCDZYkB.png', color: 0 },
  D: { img: 'https://i.imgur.com/qiI2lGV.png', color: 9967895 },
  C: { img: 'https://i.imgur.com/kkvExOR.png', color: 14377691 },
  B: { img: 'https://i.imgur.com/njIcLQV.png', color: 3492295 },
  A: { img: 'https://i.imgur.com/RGOohGm.png', color: 6795600 },
  S: { img: 'https://i.imgur.com/UcekL5e.png', color: 14598211 },
  SH: { img: 'https://i.imgur.com/cvTSy9Q.png', color: 12308694 },
  X: { img: 'https://i.imgur.com/w8uxl3o.png', color: 14598211 },
  XH: { img: 'https://i.imgur.com/LEJgPJs.png', color: 12308694 }
}
