let Discord = require('discord.js')
let bot = new Discord.Client()
let cfg = require('./config.json')
let handler = require('./handler')
let gadgets = require('./gadgets')

handler.global({ bot, cfg })

bot.on('ready', () => {
  gadgets.init()
  handler.load([__dirname, 'cmds'])
  handler.log(`Your personal servant ${bot.user.tag} is waiting for orders!`)
})

bot.on('message', msg => {
  if (!gadgets.pass(msg)) return
  handleCommand(msg)
})

function handleCommand (msg) {
  let res = handler.make(msg)
  if (res.command) {
    if (!res.metPerms) {
      msg.channel.send([
        `You need the following permissions to execute this command:`,
        `\`${res.command.permissions.join('` `')}\``
      ].join('\n'))
    } else if (!res.metArgs) {
      msg.channel.send(
        `Usage: \`${res.cmd.prefix}${res.cmd.name}${res.command.usage ? ` ${res.command.usage}` : ''}\``
      )
    } else {
      res.command.exec(msg, res.cmd).catch(e => {
        let stack = e.stack.split('\n')
        handler.error(e)
        msg.channel.send({
          embed: {
            description: stack[0],
            color: 16737380,
            author: {
              name: msg.content,
              icon_url: msg.author.avatarURL()
            },
            footer: {
              text: stack.slice(1, 4).join('\n')
            }
          }
        })
      })
      if (cfg.logging) handler.logAction(`${msg.author.id}|${msg.author.username}`, res.cmd.str)
    }
    return true
  }
}

bot.login(process.env.TOKEN)
bot.on('error', err => handler.error('Bot error:', err))
process.on('uncaughtException', err => handler.error('Uncaught Exception:', err))
process.on('unhandledRejection', err => handler.error('Unhandled Rejection:', err))
process.on('SIGINT', kill)
process.on('SIGHUP', kill)

function kill () {
  bot.destroy()
  process.exit()
}
