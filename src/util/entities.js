let entities = {
  lt: '<',
  gt: '>',
  amp: '&',
  quot: '"',
  agrave: 'à',
  Agrave: 'À',
  acirc: 'â',
  auml: 'ä',
  Auml: 'Ä',
  Acirc: 'Â',
  aring: 'å',
  Aring: 'Å',
  aelig: 'æ',
  AElig: 'Æ',
  ccedil: 'ç',
  Ccedil: 'Ç',
  eacute: 'é',
  Eacute: 'É',
  egrave: 'è',
  Egrave: 'È',
  ecirc: 'ê',
  Ecirc: 'Ê',
  euml: 'ë',
  Euml: 'Ë',
  iuml: 'ï',
  Iuml: 'Ï',
  ocirc: 'ô',
  Ocirc: 'Ô',
  ouml: 'ö',
  Ouml: 'Ö',
  oslash: 'ø',
  Oslash: 'Ø',
  szlig: 'ß',
  ugrave: 'ù',
  Ugrave: 'Ù',
  ucirc: 'û',
  Ucirc: 'Û',
  uuml: 'ü',
  Uuml: 'Ü',
  nbsp: ' ',
  copy: '\u00a9',
  reg: '\u00ae',
  euro: '\u20a0'
}

let main = {
  decodeEntities: str => {
    if (!str) return str
    let regex = new RegExp(`&(${Object.keys(entities).join('|')});`, 'g')
    return str.replace(regex, (m, e) => entities[e]).replace(/&#(\d+);/gi, (m, e) => String.fromCharCode(parseInt(e, 10)))
  }
}

module.exports = main
