let dp = require('despair')

let MIME = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/webp': 'webp'
}

module.exports = {
  async attachImages (arr) {
    for (let i = 0; i < arr.length; i++) {
      try {
        let res = await dp.head(arr[i])
        let ext = MIME[res.headers['content-type']]
        if (ext) arr[i] = { attachment: arr[i], name: `unknown.${ext}` }
      } catch (e) {}
    }
    return arr
  },
  async checkImage (url) {
    let res = await dp.head(url).catch(e => e)
    if ((res.statusCode || res.code) <= 200) {
      let size = Number(res.headers['content-length'] || '0')
      let type = res.headers['content-type'] || ''
      return size <= 8000000 && size > 0 && type.indexOf('image') >= 0 && type.indexOf('svg') < 0
    }
  },
  async sendImage (msg, url, alt) {
    if (alt && !await this.checkImage(url)) url = alt
    let img = await this.attachImages([url])
    return msg.channel.send({ files: img })
  }
}
