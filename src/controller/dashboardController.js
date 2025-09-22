import UserModel from '../model/User.js';
import IndexListModel from '../model/IndexList.js';

export const getDashboardData = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Total registered users
    const totalUsers = await UserModel.countDocuments();

    // 2. Total number of distinct active users this month (based on indexing activity)
    const activeUsers = await IndexListModel.distinct('userId', {
      checkedAt: { $gte: startOfMonth }
    });
    const activeUsersCount = activeUsers.length;

    // 3. Credits used this month (same as number of indexing requests)
    const creditsUsedThisMonth = await IndexListModel.countDocuments({
      checkedAt: { $gte: startOfMonth }
    });

    // 4. Total URLs checked across all time
    const totalURLsChecked = await IndexListModel.estimatedDocumentCount();

    res.json({
      status: 'Success',
      data: {
        totalUsers,
        activeUsers: activeUsersCount,
        creditsUsedThisMonth,
        totalURLsChecked,
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'Failed', message: error.message });
  }
};
