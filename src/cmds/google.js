let util = require('../util')
let dp = require('despair')
let hy = require('honesty')

module.exports = {
  name: 'google',
  aliases: ['g'],
  description: 'Searches on google.',
  permissions: [],
  args: 1,
  usage: '<query> (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(searchStuff, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    if (res.isList) {
      return util.showEmbedList(msg.channel, res.items, res.offset, items => {
        return {
          title: `Listing results of '${res.search}'`,
          description: items.map(x => x.url ? `[${x.title}](${x.url})` : x.title).join('\n')
        }
      })
    }
    let item = res.item
    return util.showEmbed(msg.channel, {
      title: item.title,
      url: item.url,
      description: item.desc
    })
  }
}

async function google (query) {
  let { body } = await dp('https://www.google.com/search', {
    query: {
      q: query,
      ie: 'UTF-8',
      oe: 'UTF-8',
      hl: 'en'
    },
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)  Safari/537.36' }
  })
  let $ = hy(body)
  let g = $('#rso>.g')
  let res = { query: query, results: [] }
  for (let i = 0; i < g.length; i++) {
    let item = $(g[i])
    if (g[i].attribs.class === 'g') {
      res.results.push({
        title: item.find('.r h3').text(),
        url: item.find('.r a')[0].attribs.href,
        desc: item.find('.s').text()
      })
    } else {
      if (g[i].attribs['data-md'] === '279') {
        res.snippet = {
          title: 'Google Calculator',
          desc: `${item.find('.vUGUtc').text(true)} ${item.find('.qv3Wpe').text(true)}`
        }
      } else if (g[i].attribs['data-md'] === '74') {
        res.snippet = {
          title: item.find('.XcVN5d').text(true),
          desc: item.find('.sL6Rbf')[0].children.filter(x => x.type === 'element').slice(1).map(x => $(x).text(true)).join('\n')
        }
      } else if (g[i].attribs['data-md'] === '2') {
        let details = item.find('.wob-dtl')[0].children.slice(0, 3).map(x => $(x).text(true)).join('\n')
        details = details.substr(0, details.indexOf('km/h') + 4)
        res.snippet = {
          title: 'Google Weather',
          desc: [
            item.find('#wob_wc>span')[0].children.map(x => $(x).text(true)).join('\n'),
            'Temperature: ' + item.find('#wob_tm').text(true) + '°C',
            details
          ].join('\n')
        }
      } else if (item.find('.viOShc').length) {
        res.snippet = {
          title: item.find('.Z0LcW').text(true),
          desc: item.find('.N6Sb2c').text(true).replace(/\//g, ' / ')
        }
        if (!res.snippet.desc) {
          res.snippet.desc = item.find('.e24Kjd').text(true)
        }
        if (!res.snippet.title) {
          res.snippet = {
            title: item.find('.r h3').text(true),
            url: item.find('.r a')[0].attribs.href,
            desc: item.find('.ILfuVd').text(true)
          }
        }
      }
    }
  }
  let mod = $('.mod')[0]
  if (mod) {
    if (mod.attribs['data-md'] === '112') {
      res.snippet = {
        title: 'Google Converter',
        desc: $(mod).find('#HG5Seb>input')[0].attribs.value + ' ' +
        $(mod).find('#HG5Seb>select')[0].children.find(x => x.attribs && x.attribs.selected === '1').children[0].content +
        ' = ' +
        $(mod).find('#NotFQb>input')[0].attribs.value + ' ' +
        $(mod).find('#NotFQb>select')[0].children.find(x => x.attribs && x.attribs.selected === '1').children[0].content
      }
    } else if (mod.attribs['data-md'] === '132') {
      res.snippet = {
        title: 'Google Converter',
        desc: $(mod).find('.eNFL1').text(true) + ' ' +
        $(mod).find('.vLqKYe').text(true) + ' = ' +
        $(mod).find('.SwHCTb').text(true) + ' ' +
        $(mod).find('.MWvIVe').text(true)
      }
    } else if (mod.attribs['data-md'] === '16') {
      res.snippet = {
        title: $(mod).find('.SPZz6b')[0].children.map(x => $(x).text()).join(' - '),
        desc: $('.bbVIQb').text()
      }
    }
  }
  if (res.snippet && res.snippet.desc.length > 1000) res.snippet.desc = res.snippet.desc.substr(0, 1000) + '...'
  return res
}

async function searchStuff (query) {
  let res = []
  let body = await google(query)
  res.push(...body.results)
  if (body.snippet) res.unshift(body.snippet)
  return res
}
