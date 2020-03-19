let main = {
  randomFloat: (min, max) => Math.random() * (max - min) + min,
  randomInt: (min, max) => Math.floor(main.randomFloat(min, max)),
  randomIndex: arr => main.randomInt(0, arr.length),
  randomItem: arr => arr[main.randomIndex(arr)]
}

module.exports = main
