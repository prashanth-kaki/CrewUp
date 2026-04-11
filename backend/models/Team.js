import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requiredSkills: [{ type: String }],
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' }
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
export default Team;
