const router = require('express').Router();
const BannedUsr = require('../../models/bannedUser');

router.get('/versions', (req, res) => {
  return res.json(process.versions);
});

router.get('/ban_status/:usrId', async (req, res) => {
  const { usrId } = req.params;
  if (!usrId) return;
  const databaseUser = await BannedUsr.findOne({ UserId: usrId });
  if (databaseUser) {
    const banMsgC = databaseUser.Msg ?? 'You are BANNED from the game!';
    return res
      .json({ userId: databaseUser.UserId, isBanned: true, banMsg: banMsgC });
  } else {
    return res.json({ userId: usrId, isBanned: false });
  }
});

router.post('/ban_status/modify/', async (req, res) => {
  const { userId, isBanned, banMsg, key } = req.body;
  const notFound = (res, code, message) => {
    res.status(code).json({ response: code, message: message });
  }
  if (key !== process.env.KEY) return notFound(res, 403, 'Auth Failed');
  if (!userId || isBanned === undefined) return notFound(res, 403, 'Missing Content');
  if (isBanned === true) {
    const databaseUser = await BannedUsr.findOne({ UserId: userId });
    if (databaseUser) return notFound(res, 200, 'Already Banned');
    const newUser = new BannedUsr({
      UserId: userId,
      Msg: banMsg
    });
    await newUser.save().catch(() => null);
  } else {
    const databaseUser = await BannedUsr.findOne({ UserId: userId });
    if (!databaseUser) return notFound(res, 200, 'No Change');
    await BannedUsr.findOneAndRemove(
      {
        UserId: userId
      });
  }
  return res
    .json({
      message: 200,
      userId: userId,
      isBanned: isBanned,
      banMsg: banMsg
    });
});

module.exports = router;