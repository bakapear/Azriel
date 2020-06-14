let util = require('../util')
let dp = require('despair')
let hy = require('honesty')

module.exports = {
  name: 'steam',
  aliases: [],
  description: 'Retrieves steam profile data.',
  permissions: [],
  args: 1,
  usage: '<user>',
  exec: async (msg, cmd) => {
    let user = await getPlayerData(cmd.content)
    if (!user) return msg.channel.send('User not found!')
    return util.showEmbed(msg.channel, {
      title: user.name,
      description: `${user.flag ? `:flag_${user.flag.toLowerCase()}: ` : ''}(${user.level}) ${user.created.substr(0, user.created.indexOf('T'))}`,
      fields: [
        {
          name: '\u200b',
          value: user.stats.map(x => `**${x[0]}**`),
          inline: true
        },
        {
          name: '\u200b',
          value: user.stats.map(x => `${x[1]}`),
          inline: true
        }
      ],
      url: user.url,
      thumbnail: { url: user.avatar }
    })
  }
}

async function getPlayerData (user) {
  let { body } = await dp('https://steamdb.info/calculator/', {
    query: {
      player: user,
      cc: 'eu'
    },
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)  Safari/537.36' }
  }).catch(e => { return { body: null } })
  if (!body) return null
  let $ = hy(body)
  let res = {
    name: util.decodeEntities($('.header-title>a').text()),
    url: $('.header-title>a')[0].attribs.href,
    avatar: $('.avatar')[0].attribs.src,
    level: Number($('.friendPlayerLevel').text()),
    flag: $('.flag')[0],
    created: $('.player-info .number')[0].attribs.title,
    stats: $('table')[0].children[1].children.filter(x => x.type === 'element').map(x => [$(x.children[1]).text(), $(x.children[3]).text()]).slice(0, -1)
  }
  if (res.flag) res.flag = res.flag.attribs.alt
  if (res.avatar.endsWith('appicon.svg')) res.avatar = 'https://i.imgur.com/ltK44WQ.jpg'
  return res
}
