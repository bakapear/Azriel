let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'translate',
  aliases: ['trans'],
  description: 'Translates text to english.',
  permissions: [],
  args: 1,
  usage: '<text>',
  exec: async (msg, cmd) => {
    let res = await translateGoogle(cmd.content)
    return util.showEmbed(msg.channel, {
      description: res.text,
      footer: { text: `${res.lang}-en | ${res.acc}% Accuracy` }
    })
  }
}

async function translateGoogle (text, target = 'en') {
  let body = await dp('https://translate.googleapis.com/translate_a/single', {
    query: {
      client: 'gtx',
      sl: 'auto',
      tl: target,
      hl: target,
      dt: 't',
      ie: 'UTF-8',
      oe: 'UTF-8',
      otf: 1,
      ssel: 0,
      tsel: 0,
      kc: 7,
      q: text
    }
  }).json()
  return {
    text: body[0].map(x => x[0]).join('').replace(/>/g, `\\>`),
    acc: (body[6] * 100).toFixed(2),
    lang: body[8][0][0]
  }
}
