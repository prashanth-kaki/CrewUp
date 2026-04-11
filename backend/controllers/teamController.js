import Team from '../models/Team.js';
import User from '../models/User.js';

export const createTeam = async (req, res) => {
  const { name, description, requiredSkills } = req.body;
  try {
    const team = await Team.create({
      name,
      description,
      requiredSkills: requiredSkills || [],
      owner: req.user._id,
      members: [req.user._id],
      status: 'Open'
    });
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id }).populate('members', 'name email');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', 'name email').populate('owner', 'name email');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exploreTeams = async (req, res) => {
  try {
    const openTeams = await Team.find({ status: 'Open', members: { $ne: req.user._id } });
    const userSkills = req.user.skills || [];

    // Matching Engine logic
    const matchedTeams = openTeams.map(team => {
      const required = team.requiredSkills || [];
      // Calculate intersection
      const intersection = required.filter(skill => userSkills.includes(skill));
      const matchScore = required.length === 0 ? 0 : (intersection.length / required.length) * 100;
      return {
        ...team._doc,
        matchScore
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedTeams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    if (team.status === 'Closed') {
      return res.status(400).json({ message: 'Team is closed' });
    }
    if (!team.members.includes(req.user._id)) {
      team.members.push(req.user._id);
      await team.save();
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
