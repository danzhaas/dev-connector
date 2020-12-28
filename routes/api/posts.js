const express = require ('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require ('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts/
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
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
)

// @route   GET api/posts/
// @desc    Get all posts
// @access  Private
router.get('/', auth, async(req, res) => {  
    try {
        const posts = await Post.find().sort({ date: -1 }); // date: -1 sorts by descending date
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get('/:id', auth, async(req, res) => {   // :id is a placeholder parameter
    try {
        const post = await Post.findById( req.params.id );  // findById method with argument req.params.id

        if (!post) return res.status(404).json({ msg: 'Post not found'});   // for if the id doesn't match a post 

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not found'}); // for if req.params.id isn't 12 digits
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post 
// @access  Private
router.delete('/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById( req.params.id );  // findById method taking req.params.id as an argument

        if (!post) return res.status(404).json({ msg: 'Post not found'});

        //check user
        if (post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized'});  // note: user is type ObjectId and will not === a string with same contents.  Hence we use toString()

        await post.remove();

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not found'});
        res.status(500).send('Server Error');
    }
});


module.exports = router;