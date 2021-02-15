const express = require ('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check,validationResult } = require('express-validator');
const request = require('request');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route   GET api/profile/me  
// @desc    Get current user's profile (as opposed to all profiles)
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile
            .findOne({ user: req.user.id })   // find profile where user value matches the user id decoded from the user's jwt.  
            .populate('user', ['name', 'avatar']);  //populate Profile object's user value with the name and avatar from referenced user document

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

// @route   GET api/profile  
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile
            .find()   // find all profile documents 
            .populate('user', ['name', 'avatar']);  //populate Profile object's user value with the name and avatar from referenced user document
        res.json(profiles);  // Send response containing profile objects.  
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   GET api/profile/user/:user_id
// @desc    Get one user's profile
// @access  Public
router.get('/user/:user_id', async (req, res) => {  // the : signifies the following is a route parameter that will be accessible with req.params.user_id
    try {
        const profile = await Profile
            .findOne({ user: req.params.user_id })    // find profile where user value matches the user_id route parameter in the url
            .populate('user', ['name', 'avatar']);  // populate Profile object's user value with the name and avatar from referenced user document
            if (!profile) return res.status(400).send('Profile not found'); // When the user_id is correct ObjectId format (12 digits) but doesn't match any documents
        res.json(profile);  // Send response containing profile object.  
    }
    catch(err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {   // An ObjectId error is thrown when the user_id route parameter is not a 12-digit string and thus not the format of ObjectId.  
            return res.status(400).send('Profile not found');   // We still want to communicate no profile is there
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile  
// @desc    Delete profile, user, & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        // Remove User Posts
        await Post.deleteMany({ user: req.user.id })
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted'})
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put('/experience', 
    [auth, [
        check('title', 'Title is required')
            .not()
            .isEmpty(),
        check('company', 'Company is required')
            .not()
            .isEmpty(),
        check('from', 'From date is required')
            .not()
            .isEmpty(),
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);   // Notify user of validation result
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);
            
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }
)

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from Profile
// @access  Private
router.delete("/experience/:exp_id", auth, async (req, res) => {  // the : signifies the following is a route parameter that will be accessible with req.params.exp_id
    try {
        const profile = await Profile.findOne({ user: req.user.id });   //find Profile document with user value matching that of the user id specified in the request token
        
        const removeIndex = profile.experience
            .map(item => item.id) // returns an array with the id value of each item in the experiences array
            .indexOf(req.params.exp_id);    // returns the index of only the experience with the specified exp_id parameter

        profile.experience.splice(removeIndex, 1);  // mutates the experience array to splice out the one experience with the specified index, i.e. the experience we are deleting

        await profile.save();   // save profile

        res.json(profile);  // respond with newly saved profile
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put('/education', 
    [auth, [
        check('school', 'School is required')
            .not()
            .isEmpty(),
        check('degree', 'Degree is required')
            .not()
            .isEmpty(),
        check('fieldofstudy', 'Field of study is required')
            .not()
            .isEmpty(),
        check('from', 'From date is required')
            .not()
            .isEmpty(),
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);   // Notify user of validation result
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu);
            
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }
)

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from Profile
// @access  Private
router.delete("/education/:edu_id", auth, async (req, res) => {  // the : signifies the following is a route parameter that will be accessible with req.params.exp_id
    try {
        const profile = await Profile.findOne({ user: req.user.id });   //find Profile document with user value matching that of the user id specified in the request token
        
        const removeIndex = profile.education
            .map(item => item.id) // returns an array with the id value of each item in the educations array
            .indexOf(req.params.edu_id);    // returns the index of only the education with the specified exp_id parameter

        profile.education.splice(removeIndex, 1);  // mutates the education array to splice out the one education with the specified index, i.e. the education we are deleting

        await profile.save();   // save profile

        res.json(profile);  // respond with newly saved profile
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get("/github/:username", (req, res) => { // make :username accessible from req.params.username
    try {
        const options = { // the options we use to access the github API.  See https://docs.github.com/en/free-pro-team@latest/rest
            uri: `https://api.github.com/users/${   // takes specified username and requests from Github their 5 most recently created repos
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientId'
                )}&client_secret=${config.get('githubSecret')}`,
            method:'GET',  // It's a GET to 
            headers: { 'user-agent': 'node.js' } //
        };

        request(options, (error, response, body) => {   // makes http request to API specified in the options (Github)
            if (error) console.error(error);    // Print the error if one occurred

            if(response.statusCode !== 200) {   // If the response was anything but successful,
                return res.status(404).json({ msg: 'No Github profile found' });    // Return status 404 and declare no profile was found.
            };

            res.json(JSON.parse(body)); // Respond with the parsed JSON returned from Github
        })
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router;