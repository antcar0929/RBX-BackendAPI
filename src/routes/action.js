const router = require("express").Router();
const { noblox } = require("../robloxClient");
const BannedUsr = require('../../models/bannedUser');

router.post("/ka/mr/", async (req, res) => {
  const responseAction = (message) => res.json({ message: message });
  const { userid, username, typea } = req.body;
  if (!userid || !username || isNaN(userid)) return responseAction("0x5");
  const databaseUser = await BannedUsr.findOne({ UserId: String(userid) });
  if (databaseUser) return responseAction("0x4");
  const groups = await noblox.getGroups(userid).catch(() => null);
  if (!groups) return responseAction("0x99");
  let num = 0;
  for (let i = 0, l = groups.length; i < l; i++) {
    if (groups[i].Id === 7177496) {
      num++;
      break;
    }
  };
  if (num !== 1) return responseAction("0x2");
  const rankId = await noblox.getRankInGroup(7177496, userid).catch(() => null);
  if (!rankId) return responseAction("0x2");
  let rankIdDeclare = 2;
  if (typea === "VIP") rankIdDeclare = 15;
  if (rankId >= rankIdDeclare) return responseAction("0x1");
  const result = await noblox.setRank(7177496, userid, rankIdDeclare).catch(() => null);
  if (!result) return responseAction("0x99");
  return responseAction("0x0");
});

router.post("/dw/tm/", async (req, res) => {
  const responseAction = (message) => res.json({ message: message });
  const { userid, username } = req.body;
  if (!userid || !username) return responseAction("0x5");
  if (isNaN(userid)) return responseAction("0x3");
  const groups = await noblox.getGroups(userid).catch(() => null);
  if (!groups) return responseAction("0x99");
  let num = 0;
  for (let i = 0, l = groups.length; i < l; i++) {
    if (groups[i].Id === 4764660) {
      num++;
      break;
    }
  }
  if (num !== 1) return responseAction("0x2");
  const rankId = await noblox.getRankInGroup(7177496, userid).catch(() => null);
  if (!rankId) return responseAction("0x2");
  if (rankId >= 2) return responseAction("0x1");
  const result = await noblox.setRank(7177496, userid, 2).catch(() => null);
  if (!result ?.rank) return responseAction("0x99");
  return responseAction("0x0");
});

module.exports = router;

/*
{
  {"0x0", "驗證成功", "十分感謝你的配合,你現在可以在群組聊天了!"},
  {"0x1", "無需更改", "我們更改高於成員的用戶群組等級!"},
  {"0x2", "驗證失敗", "你沒有加入我們的群組!"},
  {"0x4", "禁止存取", "你已經被本群列入封鎖名單內!"},
  {"0x99", "發生問題", "無法進行認證, 請重新嘗試!"}
}
*/