import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  content: { type: String, required: true }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
