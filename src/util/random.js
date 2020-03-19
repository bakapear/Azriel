let main = {
  randomFloat: (min, max) => Math.random() * (max - min) + min,
  randomInt: (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  randomIndex: arr => main.randomInt(0, arr.length - 1),
  randomItem: arr => arr[main.randomIndex(arr)]
}

module.exports = main
