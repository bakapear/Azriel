module.exports = {
  log: (...args) => console.info(...args),
  error: (...args) => console.error(...args),
  logAction: (who, what) => console.info(`${new Date().toISOString()} [${who}] ${what}`)
}
