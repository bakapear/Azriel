module.exports = {
  exposeToGlobal (obj) {
    for (let key in obj) {
      global[key] = obj[key]
    }
  }
}
