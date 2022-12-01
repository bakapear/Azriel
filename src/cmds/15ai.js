let dp = require('despair')

let VOICES = [
  'GLaDOS',
  'Wheatley',
  'Sentry Turret',
  'Chell',
  'Twilight Sparkle',
  'Fluttershy',
  'Rarity',
  'Rainbow Dash',
  'Pinkie Pie',
  'Applejack',
  'Princess Celestia',
  'Spike',
  'Starlight Glimmer',
  'Apple Bloom',
  'Scootaloo',
  'Zecora',
  'Derpy Hooves',
  'Lyra',
  'Bon Bon',
  'Princess Cadence',
  'Cozy Glow',
  'Queen Chrysalis',
  'Spitfire',
  'Big Mac',
  'Sunburst',
  'Minuette',
  'Cheerilee',
  'Coco Pommel',
  'Maud Pie',
  'Shining Armor',
  'Sugar Belle',
  'Vapor Trail',
  'Moondancer',
  'Lightning Dust',
  'Discord',
  'Soarin\'',
  'Diamond Tiara',
  'Silver Spoon',
  'Octavia',
  'Gilda',
  'Gabby',
  'Limestone Pie',
  'Braeburn',
  'Daring Do',
  'Snips',
  'Snails',
  'SpongeBob SquarePants',
  'Kyu Sugardust',
  'Daria Morgendorffer',
  'Jane Lane',
  'Carl Brutananadilewski',
  'Miss Pauling',
  'Scout',
  'Soldier',
  'Demoman',
  'Heavy',
  'Engineer',
  'Medic',
  'Sniper',
  'Spy',
  'Rise Kujikawa',
  'Steven Universe',
  'Dan',
  'The Narrator',
  'Stanley',
  'HAL 9000',
  'Sunset Shimmer',
  'Adagio Dazzle',
  'Aria Blaze',
  'Sonata Dusk',
  'Tenth Doctor'
]

module.exports = {
  name: '15ai',
  aliases: ['ai'],
  description: 'Speak through some voices using 15.ai',
  usage: 'voices | <voice> <message>',
  args: 2,
  async exec (msg, cmd) {
    if (cmd.args[0] === 'voices') return msg.channel.send(VOICES.map(x => `\`${x}\``).join(' '))
    let m = await msg.channel.send('Generating voice...')
    let data = await speak(cmd.args[0].replace(/_/g, ' '), cmd.args.slice(1).join(' '))
    await m.delete()
    if (data.error) return msg.channel.send(`Error: \`${data.error}\``)
    return msg.channel.send({ files: [{ attachment: Buffer.from(data.file, 'binary'), name: `${cmd.args[0]} - ${cmd.args.slice(1).join(' ')}.wav` }] })
  }
}

async function speak (voice, text) {
  let body = await dp.post('https://api.15.ai/app/getAudioFile5', {
    data: {
      text,
      character: voice,
      emotion: 'Contextual'
    },
    type: 'json'
  }).json().catch(e => { return { message: e.body } })
  if (body.message) return { error: body.message }
  else {
    let wav = await dp.get('https://cdn.15.ai/audio/' + body.wavNames[0], {
      encoding: 'binary'
    })
    return { file: wav.body }
  }
}
