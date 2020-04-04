/* global cfg */

let main = {
  showEmbed: (chan, obj, content) => {
    return chan.send({
      embed: { color: cfg.color, ...obj },
      content: content || null
    })
  },
  showEmbedList: (chan, items, offset, fn, max = 10) => {
    let total = items.length
    items.splice(0, offset)
    if (items.length > max) items.length = max
    return main.showEmbed(chan, {
      ...fn(items),
      footer: { text: `Showing ${items.length} items (${offset} - ${total})` }
    })
  },
  showError: (msg, e) => {
    let stack = e.stack.split('\n')
    return msg.channel.send({
      embed: {
        description: stack[0],
        color: 16737380,
        author: {
          name: msg.content,
          icon_url: msg.author.avatarURL()
        },
        footer: { text: stack.slice(1, 4).join('\n') }
      }
    })
  }
}

module.exports = main
