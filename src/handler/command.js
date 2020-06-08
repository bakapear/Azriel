let fs = require('fs')
let path = require('path')

let items = []

let main = {
  getCommands: () => items,
  loadCommands: dir => {
    dir = path.join(...dir)
    items = fs.readdirSync(dir).map(x => require(path.join(dir, x)))
  },
  getCommand: name => items.find(x => [x.name, ...x.aliases].includes(name)),
  formatArgs: str => {
    let args = str.substr(1).match(/[^"\s]+|"(?:\\"|[^"])+"/g) || []
    return {
      str: str,
      prefix: str[0],
      name: (args.shift() || '').toLowerCase(),
      content: str.split(' ').slice(1).join(' '),
      args: args.map(x => x[0] === '"' && x[x.length - 1] === '"' ? x.substr(1, x.length - 2) : x)
    }
  },
  make: msg => {
    let cmd = main.formatArgs(msg.content)
    let pack = { cmd }
    let command = main.getCommand(cmd.name)
    if (command) {
      pack.command = command
      pack.metArgs = cmd.args.length >= command.args
      pack.metPerms = msg.member.hasPermission(command.permissions)
    }
    return pack
  },
  executeCommand: async (msg, res) => {
    return res.command.exec(msg, res.cmd)
  }
}

module.exports = main
