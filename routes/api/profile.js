const express = require ('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me  
// @desc    Get current user's profile (as opposed to all profiles)
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile
            .findOne({ user: req.user.id })   // find profile where user value matches the user id decoded from the user's jwt.  
            .populate('user', ['name', 'avatar']);  //populate [something] with name and avatar from user 

        if (!profile) { // If there is no matching profile, 
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);  // Send response containing profile object.  
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

module.exports = router;