async function checkUserPurchase(noblox, groupId) {
  const data = await noblox
    .getGroupTransactions(groupId, 'Sale', 100)
    .catch(() => null)
  if (!data) return
  for (let i = 0, l = data.length; i < l; i++) {
    await new Promise((res) => setTimeout(res, 25000))
    let kooNum
    const userid = data[i].agent.id
    const groups = await noblox.getGroups(userid).catch(() => null)
    if (!groups) continue
    for (let i = 0, l = groups.length; i < l; i++) {
      if (groups[i].Id == groupId) {
        kooNum++
        break
      }
    }
    if (kooNum == 0) continue
    if (data[i].currency.amount > 100 && data[i].currency.type === 'Robux') {
      const rankId = await noblox
        .getRankInGroup(groupId, userid)
        .catch(() => null)
      if (!rankId) continue
      if (rankId >= 5) continue
      await noblox.setRank(groupId, userid, 5).catch(() => null)
    }
  }
}

export { checkUserPurchase }
