let { util } = require('../mod')
let dp = require('despair')

module.exports = {
  name: 'urbandictionary',
  aliases: ['urban', 'urbandic', 'define'],
  description: 'Get an urban dictionary definition of a word',
  args: 1,
  usage: '<query>',
  async exec (msg, cmd) {
    let res = await getDefinition(cmd.content)
    if (!res.length) return msg.channel.send('Nothing found!')

    let item = cmd.random ? util.randomItem(res) : res[0]

    return msg.channel.send({
      embed: {
        title: item.word,
        url: item.permalink,
        description: formatDesc([item.definition, item.example].join('\n\n')),
        timestamp: item.written_on,
        footer: { text: `by ${item.author}` }
      }
    })
  }
}

function formatDesc (str) {
  str = str.replace(/\[(.+?)\]/g, (a, b) => {
    return `${a}(https://urbandictionary.com/define.php?term=${encodeURIComponent(b)})`
  })
  return util.limit(str, 1000)
}

async function getDefinition (term) {
  let body = await dp('https://api.urbandictionary.com/v0/define', {
    query: { term }
  }).json()
  return body.list
}
