import Message from '../models/Message.js';

export const getMessagesByTeam = async (req, res) => {
  try {
    const messages = await Message.find({ team: req.params.teamId })
      .populate('sender', 'name email')
      .sort('createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMessage = async (req, res) => {
  const { content } = req.body;
  try {
    const message = await Message.create({
      sender: req.user._id,
      team: req.params.teamId,
      content
    });
    
    // Populate sender info before returning
    const populatedMessage = await Message.findById(message._id).populate('sender', 'name email');
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
