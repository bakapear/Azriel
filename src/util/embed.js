/* global cfg */

let main = {
  showEmbed: (chan, obj) => chan.send({
    embed: { color: cfg.color, ...obj }
  }),
  showEmbedList: (chan, items, offset, fn, max = 15) => {
    let total = items.length
    items.splice(0, offset)
    if (items.length > max) items.length = max
    return main.showEmbed(chan, {
      ...fn(items),
      footer: { text: `Showing ${items.length} items (${offset} - ${total})` }
    })
  }
}

module.exports = main
