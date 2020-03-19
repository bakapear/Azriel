require('./secret.js')

module.exports = {
  ...require('./command.js'),
  ...require('./log.js'),
  global: obj => {
    for (let prop in obj) {
      global[prop] = obj[prop]
    }
  }
}
