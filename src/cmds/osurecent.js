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
    let mods = convertMods(item.enabled_mods)
    item.accuracy = calculateAcc(item.count300, item.count100, item.count50, item.countmiss)
    return util.showEmbed(msg.channel, {
      title: `${map.title} - ${map.artist} [${Number(map.difficultyrating).toFixed(1)} ☆ ${map.version}]`,
      url: 'https://osu.ppy.sh/beatmaps/' + map.beatmap_id,
      description: [
        mods ? `**Mods** ${mods}` : '',
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

function convertMods (val) {
  if (!val) return ''
  val = Number(val)
  let res = ''
  for (let prop in MODS) {
    if (MODS[prop] & val) res += prop
  }
  return res.replace('DTNC', 'NC').replace('SDPF', 'PF')
}

function calculateAcc (n300, n100, n50, miss) {
  return (
    50 * Number(n50) +
    100 * Number(n100) +
    300 * Number(n300)
  ) / (300 * (
    Number(miss) +
    Number(n50) +
    Number(n100) +
    Number(n300)
  ))
}

let RANK = {
  F: { img: 'https://uh.s-ul.eu/UXr4X0NV.png', color: 0 },
  D: { img: 'https://uh.s-ul.eu/whOSayR5.png', color: 9967895 },
  C: { img: 'https://uh.s-ul.eu/6T9OEEaF.png', color: 14377691 },
  B: { img: 'https://uh.s-ul.eu/WCPNc5Zd.png', color: 3492295 },
  A: { img: 'https://uh.s-ul.eu/UpzJV0JT.png', color: 6795600 },
  S: { img: 'https://uh.s-ul.eu/5iNUSFvT.png', color: 14598211 },
  SH: { img: 'https://uh.s-ul.eu/JT7J8DE2.png', color: 12308694 },
  X: { img: 'https://uh.s-ul.eu/Pycl1RBN.png', color: 14598211 },
  XH: { img: 'https://uh.s-ul.eu/DUv6GgLq.png', color: 12308694 }
}

let MODS = {
  None: 0,
  NF: 1,
  EZ: 2,
  TD: 4,
  HD: 8,
  HR: 16,
  SD: 32,
  DT: 64,
  RL: 128,
  HT: 256,
  NC: 512,
  FL: 1024,
  A: 2048,
  SO: 4096,
  AP: 8192,
  PF: 16384,
  '4K': 32768,
  '5K': 65536,
  '6K': 131072,
  '7K': 262144,
  '8K': 524288,
  FI: 1048576,
  RD: 2097152,
  C: 4194304,
  TP: 8388608,
  '9K': 16777216,
  CO: 33554432,
  '1K': 67108864,
  '3K': 134217728,
  '2K': 268435456,
  V2: 536870912
}
