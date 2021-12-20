const { model, Schema } = require('mongoose')
const BUSchema = new Schema({
  UserId: { type: String },
  Msg: { type: String, default: null, required: false },
})
module.exports = model('BannedUsers', BUSchema)
