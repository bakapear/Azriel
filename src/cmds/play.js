/* global MediaPlayer */
let util = require('../util')
let ytt = require('ytt')

module.exports = {
  name: 'play',
  aliases: ['p', 'ps'],
  description: 'Plays media in the voice channel.',
  permissions: [],
  args: 1,
  usage: '<query> (poker)',
  exec: async (msg, cmd) => {
    let player = MediaPlayer(msg.guild.id)
    let poker = await util.poker(searchYT, cmd)
    if (poker.items.type === 'playlist') {
      poker = poker.items
      if (cmd.name === 'ps') util.shuffleArray(poker.items)
    } else poker = poker.item
    if (!poker) return msg.channel.send('Nothing found!')
    let res = await player.play(poker, msg)
    if (res.error) return msg.channel.send(res.error)
    return res
  }
}

async function searchYT (query) {
  let res = null
  let form = ytt.format(query) || {}
  if (form.type === 'video') query = 'https://youtube.com/watch?v=' + form.id
  if (form.type === 'playlist') {
    res = await ytt.playlist(form.id)
    return res
  }
  res = await ytt.query(query)
  return res.items
}
