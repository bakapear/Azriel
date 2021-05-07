let { handler, gadgets } = require('./mod')

let cfg = handler.readJSON('src/config.json')
let env = handler.loadEnv('.env')
let bot = new (require('discord.js')).Client()

handler.exposeToGlobal({ cfg, env, bot })

handler.loadCommands([__dirname, 'cmds'])

bot.login(env.TOKEN)

bot.on('ready', () => gadgets.init())

bot.on('message', async msg => {
  if (await gadgets.pass(msg)) handler.handleCommand(msg)
})

process.on('SIGINT', kill)
process.on('SIGHUP', kill)

function kill () {
  bot.destroy()
  process.exit()
}
