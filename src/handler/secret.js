let fs = require('fs')

if (fs.existsSync('.env')) {
  let lines = fs.readFileSync('.env', { encoding: 'utf-8' }).split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    let index = line.indexOf('=')
    process.env[line.substr(0, index)] = line.substr(index + 1)
  }
}
