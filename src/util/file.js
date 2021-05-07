let fs = require('fs')

module.exports = {
  readRandomLine (path) {
    let len = fs.statSync(path).size
    let pos = Math.floor(Math.random() * (len + 1))
    let file = fs.openSync(path)
    let buf = Buffer.alloc(1)
    let start = 0
    let end = 0
    let i = pos === 0 ? -1 : 1
    while (i) {
      fs.readSync(file, buf, { position: pos -= i })
      if ((i > 0 && buf[0] === 10) || pos === 0) {
        start = pos + 1
        i = -1
      } else if ((i < 0 && buf[0] === 10) || pos === len) {
        end = pos
        i = 0
      }
    }
    let out = Buffer.alloc(end - start)
    fs.readSync(file, out, { position: start })
    return out.toString()
  }
}
