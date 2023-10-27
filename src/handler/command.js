/* global cfg */
let ph = require('path')
let fs = require('fs')

let REQUIRED = ['name', 'exec']
let total = []

module.exports = {
  CMDS: [],
  loadCommands (path) {
    let dir = Array.isArray(path) ? ph.join(...path) : path
    let files = fs.readdirSync(dir, 'utf-8')
    for (let i = 0; i < files.length; i++) {
      let path = ph.join(dir, files[i])
      let cmd = require(path)
      if (!Array.isArray(cmd)) cmd = [cmd]
      for (let j = 0; j < cmd.length; j++) {
        cmd[j].path = ph.basename(path)
        cacheCMD(this, cmd[j])
      }
    }
  },
  handleCommand (msg) {
    let args = msg.content.substr(1).match(/[^"\s]+|"(?:\\"|[^"])+"/g) || []
    let prefix = msg.content.charAt(0)
    let cmd = {
      prefix,
      random: prefix === cfg.prefix.random,
      name: (args.shift() || '').toLowerCase(),
      args: args.map(x => x[0] + x.slice(-1) === '""' ? x.slice(1, -1) : x),
      content: args.join(' ')
    }

    let command = this.CMDS.find(x => x.name === cmd.name || x.aliases.includes(cmd.name))
    if (command) {
      if (command.permissions && !msg.member.hasPermission(command.permissions)) {
        msg.channel.send('You do not have the permission to use this command!')
      } else if (cmd.args < command.args) {
        msg.channel.send(command.usage
          ? `Usage: \`${cmd.prefix}${command.name} ${command.usage}\``
          : 'Invalid arguments!')
      } else if ((global.TIMEOUTS[msg.member.user.id] || 0) > Date.now()) {
        let t = global.TIMEOUTS[msg.member.user.id]
        msg.channel.send(`You are timed out and cannot use commands until \`${(new Date(t)).toLocaleString('uk').replace(', ', ' - ')}\`.`)
      } else {
        command.exec(msg, cmd).catch(e => {
          this.error(command.path, e.stack)

          let stack = e.stack.split('\n')
          msg.channel.send({
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
        })
      }
    }
  }
}

function cacheCMD (handler, cmd) {
  if (cmd.name) cmd.name = cmd.name.toLowerCase()
  if (!cmd.aliases) cmd.aliases = []
  if (!cmd.usage) cmd.usage = ''
  if (!cmd.args) cmd.args = 0

  let missing = REQUIRED.filter(x => !Object.keys(cmd).some(y => y === x))
  if (missing.length) return handler.error(cmd.path, `The following required keys are missing: ${missing.map(x => `'${x}'`).join(', ')}`)

  let dupe = total.filter(x => x === cmd.name || cmd.aliases.some(y => y === x))
  if (dupe.length) return handler.error(cmd.path, `The following keys are duplicate: ${dupe.map(x => `'${x}'`).join(', ')}`)

  total.push(cmd.name, ...cmd.aliases)
  handler.CMDS.push(cmd)
}
