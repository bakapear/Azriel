module.exports = {
  randomFloat (min, max) {
    return Math.random() * (max - min) + min
  },
  randomInt (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  randomIndex (arr) {
    return this.randomInt(0, arr.length - 1)
  },
  randomItem (arr) {
    return arr[this.randomIndex(arr)]
  }
}
