const User = require('../../models/User.js');

async function findTotalUsers(req, res) {
    try {
      const users = await User.find();
      const userIds = users.map(user => user._id);
      const totalUsers = users.length;
      res.status(200).json({ totalUsers, userIds });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Function to retrieve user details by ID
  async function getUserDetailsById(req, res) {
    const userId = req.params.id; 
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  module.exports = {
    findTotalUsers,
    getUserDetailsById,
  };
