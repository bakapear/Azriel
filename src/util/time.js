let DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

module.exports = {
  hms (ms, hide) {
    if (ms > 253402300799999 || ms < 0) throw new Error('Invalid time value')
    let strip = ~(4 * (hide === undefined ? (ms % 1000 === 0) : hide))
    let fmt = new Date(ms).toISOString()
    return ms >= 8.64e7 ? (~~(ms / 3.6e+6) + fmt.slice(13, strip)) : fmt.slice(11, strip)
  },
  getToTime (h = 0, m = 0, s = 0, ms = 0) {
    let now = new Date()
    let later = new Date()
    later.setDate(now.getDate())
    later.setHours(h)
    later.setMinutes(m)
    later.setSeconds(s)
    later.setMilliseconds(ms)
    let time = later - now
    if (time <= 0) time += 86400000
    return time
  },
  getTimeToDay (day, h = 0, m = 0, s = 0, ms = 0) {
    let d = DAYS.indexOf(day.toLowerCase()) + 1
    if (d < 1) throw new Error(`Invalid day: '${day}'`)
    let now = new Date()
    let later = new Date()
    later.setDate(now.getDate() + (d + 7 - now.getDay()) % 7)
    later.setHours(h)
    later.setMinutes(m)
    later.setSeconds(s)
    later.setMilliseconds(ms)
    let time = later - now
    if (time <= 0) time += 604800000
    return time
  }
}
