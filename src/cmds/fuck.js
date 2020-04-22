let dp = require('despair')

module.exports = {
  name: 'fuck',
  aliases: [],
  description: 'Translates text a few times back and forth.',
  permissions: [],
  args: 1,
  usage: '<text>',
  exec: async (msg, cmd) => {
    let res = { text: cmd.content, to: 'auto' }
    for (let i = 0; i < languages.length; i++) {
      res = await translate(res.text, languages[i], res.to)
    }
    res = await translate(res.text, 'en', res.to)
    return msg.channel.send(res.text)
  }
}

let languages = ['ja', 'ar', 'ko']

async function translate (text, target = 'en', source = 'auto') {
  let res = await dp('https://translate.yandex.net/api/v1.5/tr.json/translate', {
    query: {
      key: 'trnsl.1.1.20191228T162619Z.ae9fac5e3ce7b128.b8cc7b5dc723af948a8aabe275072026880e09eb',
      text: text,
      lang: source === 'auto' ? target : (source + '-' + target)
    }
  }).json().catch(e => e)
  res.from = source
  res.to = target
  res.text = res.text[0]
  return res
}
