let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'urban',
  aliases: ['define'],
  description: 'Gets an urban dictionary definition of a word.',
  permissions: [],
  args: 1,
  usage: '<query> (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getDefinition, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    let item = res.item
    return util.showEmbed(msg.channel, {
      title: item.word,
      url: item.permalink,
      description: formatDesc([item.definition, item.example].join('\n\n')),
      timestamp: item.written_on,
      footer: { text: `by ${item.author}` }
    })
  }
}

function formatDesc (str) {
  return str.replace(/\[(.+?)\]/g, (a, b) => {
    return `${a}(https://urbandictionary.com/define.php?term=${encodeURIComponent(b)})`
  })
}

async function getDefinition (term) {
  let body = await dp('https://api.urbandictionary.com/v0/define', {
    query: { term }
  }).json()
  return body.list
}
