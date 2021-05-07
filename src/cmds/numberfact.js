let dp = require('despair')

module.exports = {
  name: 'numberfact',
  aliases: ['numfact'],
  desc: 'Displays a number fact!',
  usage: '(number) (trivia/date/year/math)',
  async exec (msg, cmd) {
    let link
    let search = 'random'
    if (cmd.args[0]) {
      if (isNaN(cmd.args[0])) {
        msg.channel.send('Invalid number!')
        return
      }
      search = parseInt(cmd.args[0])
    }
    switch (cmd.args[1]) {
      case 'trivia': {
        link = `http://numbersapi.com/${search}/trivia`
        break
      }
      case 'date': {
        link = `http://numbersapi.com/${search}/date`
        break
      }
      case 'year': {
        link = `http://numbersapi.com/${search}/year`
        break
      }
      case 'math': {
        link = `http://numbersapi.com/${search}/math`
        break
      }
      default: {
        link = `http://numbersapi.com/${search}`
        break
      }
    }
    let body = await dp(link).text()
    if (body.startsWith('Cannot GET') || body.startsWith('Invalid url')) {
      return msg.channel.send('Nothing found!')
    }
    return msg.channel.send(body)
  }
}
