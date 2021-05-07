module.exports = {
  name: 'ermahgerd',
  aliases: ['emgd'],
  description: 'Talk like the Gersberms Berks Girl meme',
  args: 1,
  usage: '<message>',
  async exec (msg, cmd) {
    return msg.channel.send(doEMGD(cmd.content))
  }
}

function translate (word) {
  if (word.length === 1) return word
  switch (word) {
    case 'AWESOME': return 'ERSUM'
    case 'BANANA': return 'BERNERNER'
    case 'BAYOU': return 'BERU'
    case 'FAVORITE':
    case 'FAVOURITE': return 'FRAVRIT'
    case 'GOOSEBUMPS': return 'GERSBERMS'
    case 'LONG': return 'LERNG'
    case 'MY': return 'MAH'
    case 'THE': return 'DA'
    case 'THEY': return 'DEY'
    case 'WE\'RE': return 'WER'
    case 'YOU': return 'U'
    case 'YOU\'RE': return 'YER'
  }
  let originalWord = word
  if (originalWord.length > 2) {
    word = word.replace(/[AEIOU]$/, '')
  }
  word = word.replace(/[^\w\s]|(.)(?=\1)/gi, '')
  word = word.replace(/[AEIOUY]{2,}/g, 'E')
  word = word.replace(/OW/g, 'ER')
  word = word.replace(/AKES/g, 'ERKS')
  word = word.replace(/[AEIOUY]/g, 'ER')
  word = word.replace(/ERH/g, 'ER')
  word = word.replace(/MER/g, 'MAH')
  word = word.replace('ERNG', 'IN')
  word = word.replace('ERPERD', 'ERPED')
  word = word.replace('MAHM', 'MERM')
  if (originalWord.charAt(0) === 'Y') {
    word = 'Y' + word
  }
  word = word.replace(/[^\w\s]|(.)(?=\1)/gi, '')
  if ((originalWord.substr(-3) === 'LOW') && (word.substr(-3) === 'LER')) {
    word = word.substr(0, word.length - 3) + 'LO'
  }
  return word
}

function doEMGD (text) {
  text = text.toUpperCase()
  let lines = text.split('\n')
  let translatedLines = []
  for (let k in lines) {
    let words = lines[k].split(' ')
    let translatedWords = []
    for (let j in words) {
      let prefix = words[j].match(/^\W+/) || ''
      let suffix = words[j].match(/\W+$/) || ''
      let word = words[j].replace(prefix, '').replace(suffix, '')
      if (word) {
        translatedWords.push(prefix + translate(word) + suffix)
      } else {
        translatedWords.push(words[j])
      }
    }
    translatedLines.push(translatedWords.join(' '))
  }
  return translatedLines.join('\n')
}
