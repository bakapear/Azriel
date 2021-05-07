/* global env */
let dp = require('despair')
let key = env.WEATHER

module.exports = {
  name: 'weather',
  description: 'Get weather information of a location',
  args: 1,
  usage: '<city(,country code)>',
  async exec (msg, cmd) {
    let body = await getWeather(cmd.content)
    if (!body) return msg.channel.send('Nothing found!')
    if (body.message) return msg.channel.send(body.message)

    let temp = x => (x - 273.15).toFixed(2)
    if (body.weather.length > 4) body.weather.length = 4

    return msg.channel.send({
      embed: {
        title: `Weather in ${body.name} [${body.sys.country}]`,
        description: [
        `**Weather**: ${body.weather.map(x => x.main).join(' \\> ')}`,
        `**Temp**: ${temp(body.main.temp)}°C (${temp(body.main.temp_min)}-${temp(body.main.temp_max)})`,
        `**Wind**: ${body.wind.speed}m/s` + (body.wind.deg ? ` ${body.wind.deg}°` : '')
        ].join('\n')
      }
    })
  }
}

async function getWeather (query) {
  let body = await dp('https://api.openweathermap.org/data/2.5/weather', {
    query: { q: query, APPID: key }
  }).json().catch(e => JSON.parse(e.body))
  return body
}
