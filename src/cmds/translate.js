let util = require('../util')
let qr = require('querystring')
let dp = require('despair')

module.exports = {
  name: 'translate',
  aliases: ['trans'],
  description: 'Translates text.',
  permissions: [],
  args: 1,
  usage: '<text> (-lang)',
  exec: async (msg, cmd) => {
    let lang = 'en'
    let text = cmd.content
    if (cmd.args[cmd.args.length - 1].startsWith('-')) {
      text = cmd.content.split(' ')
      lang = text.pop().substr(1)
      text = text.join(' ')
    }
    let res = await translateGoogle(text, lang)
    if (res.error) return msg.channel.send(res.error)
    return util.showEmbed(msg.channel, {
      description: res.text,
      footer: { text: `${res.lang.from}-${res.lang.to} | ${res.acc}% Accuracy` }
    })
  }
}

async function translateGoogle (text, target = 'en') {
  let query = {
    client: 'gtx',
    sl: 'auto',
    tl: target,
    hl: target,
    dt: ['qca', 't'],
    ie: 'UTF-8',
    oe: 'UTF-8',
    otf: 1,
    ssel: 0,
    tsel: 0,
    kc: 7,
    q: text
  }
  let body = await dp('https://translate.googleapis.com/translate_a/single?' + qr.stringify(query)).json().catch(e => null)
  if (!body) return { error: 'Something went wrong!' }
  return {
    text: body[0].map(x => x[0]).join('').replace(/>/g, `\\>`),
    acc: (body[6] * 100).toFixed(2),
    lang: { from: body[8][0][0], to: target }
  }
}
