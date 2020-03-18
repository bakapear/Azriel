let dp = require('despair')

module.exports = {
  name: 'math',
  aliases: ['m'],
  description: `Evaluates a mathematical expression.`,
  permissions: [],
  args: 1,
  usage: '<expression>',
  exec: async (msg, cmd) => {
    msg.channel.send(await doMath(cmd.content))
  }
}

async function doMath (expression) {
  let body = await dp('https://api.mathjs.org/v4/', {
    query: { expr: expression }
  }).json().catch(e => e.body)
  return body
}
