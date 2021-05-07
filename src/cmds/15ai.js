let dp = require('despair')

module.exports = {
  name: '15ai',
  aliases: ['ai'],
  description: 'Speak through some voices using 15.ai',
  usage: '<voice> <message>',
  args: 2,
  async exec (msg, cmd) {
    let m = await msg.channel.send('Generating voice...')
    let data = await speak(cmd.args[0].replace(/_/g, ' '), cmd.args.slice(1).join(' '))
    await m.delete()
    if (data.error) return msg.channel.send(`Error: \`${data.error}\``)
    return msg.channel.send({ files: [{ attachment: Buffer.from(data.file, 'binary'), name: `${cmd.args[0]} - ${cmd.args.slice(1).join(' ')}.wav` }] })
  }
}

async function speak (voice, text) {
  let body = await dp.post('https://api.15.ai/app/getAudioFile', {
    data: {
      text: text,
      character: voice,
      emotion: 'Contextual',
      use_diagonal: true
    },
    type: 'json',
    encoding: 'binary'
  }).text().catch(e => { return { message: e.body } })
  if (body.message) return { error: body.message }
  else return { file: body }
}
