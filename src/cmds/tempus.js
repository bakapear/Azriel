let dp = require('despair')

module.exports = {
  name: 'tempus',
  aliases: ['tpus'],
  description: 'Get map/player information of tempus servers',
  args: 2,
  usage: 'player <steamid> | map <name>',
  async exec (msg, cmd) {
    switch (cmd.args[0].toLowerCase()) {
      case 'player': {
        let player = await getPlayerStats(cmd.args[1])
        if (player.error) return msg.channel.send(player.error)
        return msg.channel.send({
          embed: {
            title: player.player_info.name,
            description: [
              `**Soldier** - #${player.class_rank_info[3].rank} (${player.class_rank_info[3].points} Points)`,
              `**Demoman** - #${player.class_rank_info[4].rank} (${player.class_rank_info[4].points} Points)`,
              `**Overall** - #${player.rank_info.rank} (${player.rank_info.points} Points)`,
              `**${player.player_info.country}** - ${player.country_rank_info.rank}/${player.country_rank_info.total_ranked}`
            ].join('\n')
          }
        })
      }
      case 'map': {
        let map = await getMapStats(cmd.args[1].toLowerCase())
        if (map.error) return msg.channel.send(map.error)
        return msg.channel.send({
          embed: {
            title: map.map_info.name,
            description: [
              `[S${map.tier_info.soldier} D${map.tier_info.demoman}] by ${map.authors.map(x => x.name).join(', ')}\n`,
              `**Soldier WR** ${time(map.soldier_runs[0].duration * 1000)} > ${map.soldier_runs[0].name}`,
              `**Demoman WR** ${time(map.demoman_runs[0].duration * 1000)} > ${map.demoman_runs[0].name}`
            ].join('\n')
          }
        })
      }
    }
  }
}

async function getPlayerStats (id) {
  try {
    let body = await dp(`https://tempus.xyz/api/players/steamid/${id}/stats`).json().catch(e => JSON.parse(e.body))
    return body
  } catch (e) { return { error: 'Something went wrong!' } }
}

async function getMapStats (name) {
  try {
    let body = await dp(`https://tempus.xyz/api/maps/name/${name}/fullOverview`).json().catch(e => JSON.parse(e.body))
    return body
  } catch (e) { return { error: 'Something went wrong!' } }
}

let time = x => {
  let t = new Date(x).toISOString().substr(11, 8).split(':')
  let h = Math.floor(x / 1000 / 60 / 60).toString()
  if (h > 23) t[0] = h
  while (t.length > 2 && t[0] === '00' && t[1].startsWith('0')) {
    t.shift()
  }
  if (t.length > 2 && t[0] === '00') t.shift()
  if (t[0].startsWith('0')) t[0] = t[0].substr(1)
  return t.join(':')
}
