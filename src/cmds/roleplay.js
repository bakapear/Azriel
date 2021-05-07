let { util } = require('../mod')
let dp = require('despair')

let API = Object.values({
  ksoft: {
    disabled: true,
    url: 'https://api.ksoft.si/images/random-image?tag=',
    tags: ['birb', 'cat', 'clap', 'dab', 'dog', 'doge', 'fbi', 'fox', 'headrub', 'hug', 'kappa', 'kiss', 'lick', 'neko', 'pat', 'pepe', 'tickle'],
    fn: x => x.url
  },
  neko: {
    url: 'https://neko-love.xyz/api/v1/',
    tags: ['cry', 'hug', 'kiss', 'kitsune', 'neko', 'pat', 'punch', 'slap', 'smug'],
    fn: x => x.url
  },
  rra: {
    url: 'https://rra.ram.moe/i/r?type=',
    tags: ['cry', 'cuddle', 'hug', 'kermit', 'kiss', 'lewd', 'lick', 'nom', 'nyan', 'owo', 'pat', 'potato', 'pout', 'rem', 'slap', 'smug', 'stare', 'tickle', 'triggered', 'weird'],
    fn: x => 'https://rra.ram.moe' + x.path
  }
}).filter(x => !x.disabled)

let TAGS = [...new Set(API.reduce((a, e) => a.push(...e.tags) && a, []))]

module.exports = {
  name: 'roleplay',
  aliases: TAGS,
  description: 'Get a random reaction image',
  async exec (msg, cmd) {
    let tag = (cmd.name === this.name) ? util.randomItem(TAGS) : cmd.name
    let service = util.randomItem(API.filter(x => x.tags.includes(tag)))

    let body = await dp(service.url + tag).json()
    return util.sendImage(msg, service.fn(body))
  }

}
