/* global MediaPlayer */
let util = require('../util')
let ytt = require('ytt')

function Player (id) {
  this.id = id
  this.channel = null
  this.connection = null
  this.dispatcher = null
  this.playing = false
  this.queue = []
}

Player.prototype.play = async function (item, msg) {
  if (!this.connection && !await this.join(msg.member.voice.channel)) {
    return this.message('novoice')
  }
  if (!this.channel) this.channel = msg.channel
  let items = []
  if (item.type !== 'playlist') item.items = [item]
  for (let i = 0; i < item.items.length; i++) {
    let o = item.items[i]
    items.push({
      type: 'yt',
      id: o.id,
      url: o.url,
      img: o.thumbnail,
      name: o.name,
      duration: o.duration,
      time: o.time,
      author: msg.member
    })
  }
  await this.add(items)
  if (!this.playing) {
    if (items.length > 1) {
      this.message('queue', { ...item, author: msg.member }, msg.channel)
    }
    await this.start(this.queue[0])
    this.playing = true
  } else {
    if (items.length > 1) {
      this.message('queue', { ...item, author: msg.member }, msg.channel)
    } else {
      this.message('queue', items[0], msg.channel)
    }
  }
  return item
}

Player.prototype.add = async function (items) {
  for (let i = 0; i < items.length; i++) this.queue.push(items[i])
}

Player.prototype.join = async function (channel) {
  if (channel) {
    this.connection = await channel.join()
    return true
  }
}

Player.prototype.stop = async function () {
  if (!this.connection) return this.message('noplay')
  await this.connection.channel.leave()
  this.channel = null
  this.connection = null
  this.dispatcher = null
  this.playing = false
  this.queue = []
}

Player.prototype.start = async function (item) {
  this.playing = true
  if (item.type === 'yt') {
    let res = await ytt.download(item.id)
    this.dispatcher = this.connection.play(res.formats[res.formats.length - 1].url)
  }
  this.message('nowplaying', item)
  this.dispatcher.on('finish', () => {
    this.queue.shift()
    if (this.queue.length) {
      this.start(this.queue[0])
    } else this.playing = false
  })
}

Player.prototype.skip = function () {
  if (!this.playing) return this.message('noplay')
  if (this.dispatcher) this.dispatcher.end()
}

Player.prototype.shuffle = function () {
  if (!this.playing) return this.message('noplay')
  let temp = this.queue.shift()
  util.shuffleArray(this.queue)
  this.queue.unshift(temp)
}

Player.prototype.message = function (type, item, channel) {
  if (!channel) channel = this.channel
  switch (type) {
    case 'queue': {
      if (item.type === 'playlist') {
        return util.showEmbed(channel, {
          title: `Added ${item.items.length} Items to Queue`,
          url: item.url,
          description: `\`${item.name}\``,
          thumbnail: { url: item.thumbnail },
          footer: {
            text: item.author.user.tag + ' • ' + item.time,
            icon_url: item.author.user.avatarURL()
          }
        })
      }
      return util.showEmbed(channel, {
        title: 'Added to Queue',
        url: item.url,
        description: `\`${item.name}\``,
        thumbnail: { url: item.img },
        footer: {
          text: item.author.user.tag + ' • ' + item.time,
          icon_url: item.author.user.avatarURL()
        }
      })
    }
    case 'nowplaying': {
      return util.showEmbed(channel, {
        title: 'Now Playing',
        url: item.url,
        description: `\`${item.name}\``,
        thumbnail: { url: item.img },
        footer: {
          text: item.author.user.tag + ' • ' + item.time,
          icon_url: item.author.user.avatarURL()
        }
      })
    }
    case 'novoice': {
      return { error: 'You\'re not in a voice channel!' }
    }
    case 'noplay': {
      return { error: 'Nothing is playing right now!' }
    }
  }
}

module.exports = id => {
  if (!MediaPlayer[id]) MediaPlayer[id] = new Player(id)
  return MediaPlayer[id]
}
