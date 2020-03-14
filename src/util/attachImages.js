let dp = require('despair')

let mimeTypes = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/webp': 'webp'
}

module.exports = async arr => {
  for (let i = 0; i < arr.length; i++) {
    try {
      let res = await dp.head(arr[i])
      let ext = mimeTypes[res.headers['content-type']]
      if (ext) arr[i] = { attachment: arr[i], name: `unknown.${ext}` }
    } catch (e) {}
  }
  return arr
}
