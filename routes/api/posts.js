const express = require ('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require ('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST routes/api/posts/
// @desc    Create a post
// @access  Private
router.post('/', 
    [ // middleware
        auth, // authentication
        [   // validation checks
            check('text', 'Text is required') // checks if text is entered - cannot be empty
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);   // validation results
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');  // declares user which references the user document corresponding to user's token, but doesn't include their password for security reasons

            const newPost = new Post({  // declares the new post as a Post document and populates the name and avatar values with data from the User document 
                text: req.body.text,
                name: user.name,
                avatar:user.avatar,
                user:req.user.id
            });

            const post = await newPost.save();  // declares post as the saved newPost Post document

            res.json(post); // responds with the saved Post document 
        } catch (error) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
)

module.exports = router;