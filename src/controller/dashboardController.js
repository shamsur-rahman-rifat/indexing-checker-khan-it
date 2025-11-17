import UserModel from '../model/User.js';
import IndexListModel from '../model/IndexList.js';

export const getDashboardData = async (req, res) => {
  try {
    const email = req.headers['email']; // Get email from auth middleware
    if (!email) {
      return res.status(400).json({ status: 'Failed', message: 'Email is required to fetch dashboard data' });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'Failed', message: 'User not found' });
    }

    // 1. Total URLs checked by the user
    const totalURLsChecked = await IndexListModel.countDocuments({ userId: user._id });

    // 2. Number of indexed URLs for the user
    const indexedURLs = await IndexListModel.countDocuments({
      userId: user._id,
      indexed: true
    });

    // 3. Number of not indexed URLs for the user
    const notIndexedURLs = await IndexListModel.countDocuments({
      userId: user._id,
      indexed: false
    });

    res.json({
      status: 'Success',
      data: {
        totalURLsChecked,
        indexedURLs,
        notIndexedURLs,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'Failed', message: error.message });
  }
};
