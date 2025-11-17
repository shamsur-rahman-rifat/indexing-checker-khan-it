import axios from 'axios';
import UserModel from '../model/User.js';
import IndexListModel from '../model/IndexList.js';

// Function to check if a URL is indexed by Google
async function checkIndexingAPI(url) {
  const data = JSON.stringify({ q: `site:${url}` });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://google.serper.dev/search',
    headers: {
      'X-API-KEY': process.env.SERP_API_KEY,
      'Content-Type': 'application/json',
    },
    data,
  };

  try {
    const response = await axios.request(config);
    const organicResults = response.data.organic || [];

    const isIndexed = organicResults.some(result =>
      result.link && result.link.includes(url)
    );

    return isIndexed;
  } catch (error) {
    throw new Error(error.response?.data || error.message || 'API Request Failed');
  }
}

// Bulk check indexing controller
export const bulkCheckIndexing = async (req, res) => {
  try {
    let { urls } = req.body;
    const email = req.headers['email']; // Get email from auth middleware

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ status: 'Failed', message: 'URLs array is required' });
    }

    // Limit to 10 URLs for unauthenticated users
    if (!email) {
      if (urls.length > 10) {
        return res.status(400).json({ status: 'Failed', message: 'You can only check a maximum of 10 URLs at a time' });
      }
    }

    let user = null;
    if (email) {
      user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ status: 'Failed', message: 'User not found' });
      }

      // Check if user has enough credits if authenticated
      const requiredCredits = urls.length;
      if (user.credits < requiredCredits) {
        return res.status(400).json({
          status: 'Failed',
          message: `Not enough credits. You need ${requiredCredits} credits.`,
        });
      }
    }

    const results = await Promise.all(
      urls.map(async (url) => {
        try {
          const isIndexed = await checkIndexingAPI(url);

          // Store indexing result if user is authenticated
          if (user) {
            await IndexListModel.create({
              email,
              userId: user._id,
              url,
              indexed: isIndexed,
            });
          }

          return { url, status: 'Success', indexed: isIndexed };
        } catch (err) {
          return { url, status: 'Failed', message: err.message };
        }
      })
    );

    // If user is authenticated, deduct credits
    if (user) {
      const requiredCredits = urls.length;
      user.credits -= requiredCredits;
      await user.save();
    }

    res.json({
      status: 'Success',
      message: `Checked ${urls.length} URLs`,
      credits: user ? user.credits : null,
      results,
    });
  } catch (error) {
    res.status(500).json({ status: 'Failed', message: error.message });
  }
};

// Get user's indexing history
export const getUserIndexingHistory = async (req, res) => {
  try {
    const email = req.headers['email'];

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'Failed', message: 'User not found' });
    }

    const history = await IndexListModel.find({ email })
      .sort({ checkedAt: -1 })
      .select('url indexed checkedAt');

    res.json({
      status: 'Success',
      count: history.length,
      history,
    });
  } catch (error) {
    res.status(500).json({ status: 'Failed', message: error.message });
  }
};
