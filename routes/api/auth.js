const express = require ('express');
const router = express.Router();
const auth = require('../../middleware/auth');  // brings in jwt auth middleware

const User = require('../../models/User');  //brings in User model

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => { // note auth middleware and async because we're making a call to the database
    try {
        const user = await User.findById(req.user.id)  // jwt authorization happens here: the findById method calls req.user we declared in the auth middleware
        .select('-password');  // query for the above user will exclude the password field
        res.json(user); // response inludes the object returned by user document query
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;