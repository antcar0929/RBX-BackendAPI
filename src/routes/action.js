import { Router } from 'express'
import noblox from '../robloxClient.js'
import BannedUsr from '../../models/bannedUser.js'
const router = Router()

/*
{
  {"0x0", "驗證成功", "十分感謝你的配合,你現在可以在群組聊天了!"},
  {"0x1", "無需更改", "我們更改高於成員的用戶群組等級!"},
  {"0x2", "驗證失敗", "你沒有加入我們的群組!"},
  {"0x4", "禁止存取", "你已經被本群列入封鎖名單內!"},
  {"0x99", "發生問題", "無法進行認證, 請重新嘗試!"}
}
*/

router.post('/ka/mr/', async (req, res) => {
  const resa = (message) => res.json({ message: message })
  const { userid, username, typea } = req.body
  if (!userid || !username || isNaN(userid)) return resa('0x5')
  if (await BannedUsr.findOne({ UserId: String(userid) })) return resa('0x4')
  const groups = await noblox.getGroups(userid).catch(() => null)
  if (!groups) return resa('0x99')
  let num = 0
  for (let i = 0, l = groups.length; i < l; i++) {
    if (groups[i].Id === 7177496) {
      num++
      break
    }
  }
  if (num !== 1) return resa('0x2')
  const rankId = await noblox.getRankInGroup(7177496, userid).catch(() => null)
  if (!rankId) return resa('0x2')
  let rkId = 2
  if (typea === 'VIP') rkId = 15
  if (rankId >= rkId) return resa('0x1')
  return resa(
    (await noblox.setRank(7177496, userid, rkId).catch(() => null))
      ? '0x0'
      : '0x99'
  )
})
/*
router.post('/dw/tm/', async (req, res) => {
  const resa = (message) => res.json({ message: message })
  const { userid, username } = req.body
  if (!userid || !username) return resa('0x5')
  if (isNaN(userid)) return resa('0x3')
  const groups = await noblox.getGroups(userid).catch(() => null)
  if (!groups) return resa('0x99')
  let num = 0
  for (let i = 0, l = groups.length; i < l; i++) {
    if (groups[i].Id === 4764660) {
      num++
      break
    }
  }
  if (num !== 1) return resa('0x2')
  const rankId = await noblox.getRankInGroup(7177496, userid).catch(() => null)
  if (!rankId) return resa('0x2')
  if (rankId >= 2) return resa('0x1')
  const result = await noblox.setRank(7177496, userid, 2).catch(() => null)
  if (!result?.rank) return resa('0x99')
  return resa('0x0')
})
*/
export default router
