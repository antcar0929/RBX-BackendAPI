const router = require('express').Router()
const BannedUsr = require('../../models/bannedUser')

router.get('/versions', (req, res) => res.json(process.versions))

router.get('/ban_status/:usrId', async (req, res) => {
  const { usrId } = req.params
  if (!usrId) return
  const databaseUser = await BannedUsr.findOne({ UserId: usrId })
  if (databaseUser) {
    const banMsgC = databaseUser.Msg ?? 'You are BANNED from the game!'
    return res.json({
      userId: databaseUser.UserId,
      isBanned: true,
      banMsg: banMsgC,
    })
  }
  return res.json({ userId: usrId, isBanned: false })
})

router.post('/ban_status/modify/', async (req, res) => {
  const { userId, isBanned, banMsg, key } = req.body
  const nf = (res, code, message) => {
    res.status(code).json({ response: code, message: message })
  }
  if (key !== process.env.KEY) return nf(res, 403, 'Auth Failed')
  if (!userId || isBanned === void 0) return nf(res, 403, 'Missing Content')
  const dbUser = await BannedUsr.findOne({ UserId: userId })
  if (isBanned === true) {
    if (dbUser) return nf(res, 200, 'Already Banned')
    const newUser = new BannedUsr({
      UserId: userId,
      Msg: banMsg,
    })
    await newUser.save().catch(() => null)
  } else {
    if (!dbUser) return nf(res, 200, 'No Change')
    await BannedUsr.findOneAndRemove({
      UserId: userId,
    })
  }
  return res.json({
    message: 200,
    userId: userId,
    isBanned: isBanned,
    banMsg: banMsg,
  })
})

module.exports = router
