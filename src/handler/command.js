let fs = require('fs')
let path = require('path')

let main = {
  cache: [],
  load: dir => {
    dir = path.join(...dir)
    main.cache = fs.readdirSync(dir).map(x => require(path.join(dir, x)))
  },
  get: name => main.cache.find(x => [x.name, ...x.aliases].includes(name)),
  format: str => {
    let args = str.substr(1).match(/[^"\s]+|"(?:\\"|[^"])+"/g) || []
    return {
      str: str,
      prefix: str[0],
      name: args.shift().toLowerCase(),
      content: str.split(' ').slice(1).join(' '),
      args: args.map(x => x[0] === '"' && x[x.length - 1] === '"' ? x.substr(1, x.length - 2) : x)
    }
  },
  make: msg => {
    let cmd = main.format(msg.content)
    let pack = { cmd }
    let command = main.get(cmd.name)
    if (command) {
      pack.command = command
      pack.metArgs = cmd.args.length >= command.args
      pack.metPerms = msg.member.hasPermission(command.permissions)
    }
    return pack
  }
}

module.exports = main
