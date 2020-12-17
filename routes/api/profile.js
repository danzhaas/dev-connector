const express = require ('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check,validationResult } = require('express-validator');

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

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, [    //validate fields
    check('status', 'Status is required')
        .not()
        .isEmpty(),
    check('skills', 'Skills is required')
        .not()
        .isEmpty(),
    ], 
    async (req, res) => {
        const errors = validationResult(req);   // Notify user of validation result
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { // deconstruct fields from request body
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        // Build profile object
        const profileFields = {};   // initializes empty profileFields object which is the temporary container for the document's key/value pairs.  
        profileFields.user = req.user.id;   // reference user id corresponding to this profile
        if (company) profileFields.company = company;   //check if fields are populated before referencing
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());    // Transforms the string input into an array
        }

        // Build social object
        profileFields.social = {};  // initializes social as an empty object within profileFields
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({ user: req.user.id }); // find user profile
            if (profile) {  // update profile if it already exists
                profile = await Profile.findOneAndUpdate(   // Updates an existing profile
                    { user: req.user.id }, // first parameter is the filter
                    { $set: profileFields },    // second parameter is the fields being updated
                    { new: true }   // returns the updated document; the default return reference is the old (pre-update) document
                );
                return res.json(profile);
            }

            profile = new Profile(profileFields);   // create new profile if it does not yet exist

            await profile.save();   // Inserts the document into the database
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }
);

module.exports = router;