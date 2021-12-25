import mongoose from 'mongoose'
const { model, Schema } = mongoose

const BUSchema = new Schema({
  UserId: { type: String },
  Msg: { type: String, default: null, required: false },
})

export default model('BannedUsers', BUSchema)
