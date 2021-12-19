const noblox = require('noblox.js')
noblox.setCookie(process.env.ROBLOX_COOKIES)
const { checkUserPurchase } = require('./jobs')
setInterval(async () => checkUserPurchase(noblox, 7177496), 60000 * 60)

module.exports = {
  noblox,
}
