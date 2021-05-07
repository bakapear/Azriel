let ta = x => `\x1b[${x}m`
let ra = new RegExp(ta(39).replace('[', '\\['), 'g')
let fa = (x, y) => ta(y) + x.replace(ra, '$&' + ta(y)) + ta(39)
let co = {
  black: x => fa(x, 30),
  red: x => fa(x, 31),
  green: x => fa(x, 32),
  yellow: x => fa(x, 33),
  blue: x => fa(x, 34),
  magenta: x => fa(x, 35),
  cyan: x => fa(x, 36),
  white: x => fa(x, 37)
}

module.exports = {
  color: co,
  log (...msg) {
    console.log(...msg)
  },
  error (who, what) {
    console.log(`${co.black(`[${who}]`)} ${co.red('[Error]')} ${co.white(what)}`)
  }
}
