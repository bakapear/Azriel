module.exports = {
  name: 'rate',
  description: 'Rate something from 0 to 10',
  async exec  (msg, cmd) {
    let query = cmd.content.toLowerCase()
    if (['jibril', 'azriel'].includes(query)) return msg.channel.send('Top tier.')
    let rnd = Math.floor(random(query) * 11)
    let rate = `Rated **${rnd}/10**!`
    if (rnd === 10) rate += ' <3'
    return msg.channel.send(rate)
  }
}

function random (word) {
  if (!word) return Math.random()
  let seed = word.split('').map(x => x.charCodeAt(0)).join('')
  let x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}
