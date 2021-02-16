let util = require('../util')
let Discord = require('discord.js')
let dp = require('despair')
let hy = require('honesty')

let env = {
  GOOGLE_SID: process.env.GOOGLE_SID,
  GOOGLE_NID: process.env.GOOGLE_NID
}

module.exports = {
  name: 'google',
  aliases: ['g'],
  description: 'Search for results on google.',
  permissions: [],
  args: 1,
  usage: '<query>',
  exec: async (msg, cmd) => {
    let g = await google(cmd.content, true)
    if (!g.items.length) return msg.channel.send('Nothing found!')

    let item = g.items[0]

    let embed = new Discord.MessageEmbed()
      .setTitle(item.title)
      .setURL(item.url)
      .addField(`__${item.path}__`, item.description)
    if (item.extra.links) embed.addField('\u200B', item.extra.links)

    if (item.extra.footer) embed.setFooter(item.extra.footer)
    if (item.extra.thumbnail) {
      embed
        .attachFiles({ name: 'file.png', attachment: Buffer.from(item.extra.thumbnail, 'base64') })
        .setThumbnail('attachment://file.png')
    }
    if (item.extra.answer) {
      let list = item.extra.list ? `\n${item.extra.list}` : ''
      let answer = list ? `__${item.extra.answer}__` : `**${item.extra.answer}**`
      let txt = `${item.extra.heading || ''}\n${answer}${list}`

      if (item.description) embed.setDescription(txt)
      else embed.spliceFields(0, 1, [{ name: `__${item.path}__`, value: txt }])
    }

    return msg.channel.send(embed)
  }
}

async function google (search, markdown) {
  let md = (element, fn, fn2) => {
    if (!element) return
    let parse = (el, tags = [], href = '', classes = [], r = []) => {
      if (el.tag) tags.push(el.tag)
      if (el.attribs && el.attribs.href) {
        href = el.attribs.href
        if (href[0] === '/') href = 'https://google.com' + href
      }
      if (el.attribs && el.attribs.class) classes.push(...el.attribs.class.split(' '))
      if (el.content) return [{ text: el.content, tags, href, classes, r: r[0] }]
      else if (el.children) {
        let res = []
        for (let i = 0; i < el.children.length; i++) {
          res.push(...parse(el.children[i], tags.slice(0), href, classes.slice(0), [...r.slice(), i]))
        }
        return res
      }
    }
    let nodes = parse(element)

    if (!markdown) {
      return nodes.map(x => {
        delete x.classes
        delete x.tags
        if (!x.href) delete x.href
        return x
      })
    }

    let follow = false
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i]
      if (fn) node = fn(node, i, nodes)
      if (!node) continue
      let txt = util.decodeEntities(node.text.replace(/[[\]()_*~`|]/g, '\\$&'))
      for (let j = node.tags.length - 1; j >= 0; j--) {
        switch (node.tags[j]) {
          case 'b': case 'em': {
            txt = `**${txt}**`
            break
          }
          case 'a': {
            let url = node.href
            if (url) {
              if (nodes[i + 1] && nodes[i + 1].href === url) {
                if (!follow) {
                  follow = true
                  txt = `[${txt}`
                }
              } else {
                if (!follow) txt = `[${txt}](${url})`
                else {
                  txt = `${txt}](${url})`
                  follow = false
                }
              }
            }
            break
          }
        }
      }
      if (fn2) txt = fn2(txt, i, nodes)
      nodes[i] = txt
    }
    return nodes.join('')
  }

  let body = await dp('https://www.google.com/search', {
    query: { q: search },
    headers: {
      Cookie: `__Secure-3PSID=${env.GOOGLE_SID};NID=${env.GOOGLE_NID};`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36'
    }
  }).text()

  let dimg = {}
  let index = 0
  while (index !== -1) {
    let s = body.indexOf('var s=', index + 1)
    let e = body.indexOf('var ii=', s)
    index = s
    if (index >= 0) dimg[body.substring(e + 9, body.indexOf('];', e) - 1)] = body.substring(s + 29, e - 10) + '=='
  }

  let $ = hy(body)

  let items = $('#rso>.g').map((item, i) => {
    item = $(item)
    let url = item.find('.yuRUbf>a')[0]
    if (!url) return null

    let mod = $('.mod')
    let res = {
      title: item.find('.DKV0Md').text(),
      url: url.attribs.href,
      path: item.find('.NJjxre').text(),
      description: md(item.find('.aCOpRe span').pop()),
      extra: {
        footer: item.find('.aCOpRe span.f').text().slice(0, -3) || item.find('.fG8Fp.uo4vr').text() || item.find('.Od5Jsd').text() || null,
        links: md(item.find('.HiHjCd')[0]) || md(item.find('.P1usbc')[0], (x, i, a) => {
          if (!x.classes.includes('fl')) {
            if ((a[i - 1] && a[i - 1].endsWith('\n'))) a[i - 1] = ''
            x.text = ` · ${x.text}\n` // TODO: make date appear before link
          }
          return x
        }) || md(item.find('.ZGh7Vc')[0]) || null
      }
    }
    if (i === 0 && mod.length) {
      if (!res.description) res.description = md(mod.find('.hgKElc')[0])
      if (!res.extra.footer) res.extra.footer = mod.find('.kX21rb').text() || null
      res.extra.heading = mod.find('.i29hTd').text() || null
      res.extra.answer = mod.find('.XcVN5d').text() || null
      res.extra.list = md(mod.find('.i8Z77e')[0] || mod.find('.X5LH0c')[0], (x, i, a) => {
        if (a[i + 1] && a[i + 1].r > x.r) x.text += '\n- '
        return x
      }, (x, i, a) => (i === 0) ? `- ${x}` : x) || null
      let thumb = mod.find('.GNxIwf img')[0]
      if (thumb) res.extra.thumbnail = dimg[thumb.attribs.id] || null
    }
    return res
  }).filter(x => x)

  let size = $('#result-stats').text().split(' ')[1]

  let query = {
    value: $('.gLFyf')[0].attribs.value,
    real: $('#fprsl').text(1) || null,
    corrected: md($('#fprsl')[0]) || null,
    didYouMean: $('.med').find('.NYKCib').map(x => md(x)).join(' · ') || md($('.med a.gL9Hy')[0]) || null,
    results: size ? parseInt(size.replace(/,/g, '')) : 0
  }

  return { query, items }
}
