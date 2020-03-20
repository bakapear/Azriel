let dp = require('despair')

module.exports = {
  name: 'math',
  aliases: ['m', 'calc'],
  description: 'Evaluates a mathematical expression.',
  permissions: [],
  args: 1,
  usage: '<expression>',
  exec: async (msg, cmd) => {
    return msg.channel.send(await doMath(cmd.content))
  }
}

async function doMath (expression) {
  let body = await dp('https://api.mathjs.org/v4/', {
    query: { expr: expression }
  }).json().catch(e => e.body)
  return body
}
