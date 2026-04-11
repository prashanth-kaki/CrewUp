import Resource from '../models/Resource.js';

export const uploadResource = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // req.file.location is populated by multer-s3
    const newResource = await Resource.create({
      name: req.file.originalname,
      url: req.file.location || req.file.path, // fallback for local if not using S3 directly in dev
      team: req.body.teamId,
      uploadedBy: req.user._id
    });

    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResourcesByTeam = async (req, res) => {
  try {
    const resources = await Resource.find({ team: req.params.teamId }).populate('uploadedBy', 'name');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
