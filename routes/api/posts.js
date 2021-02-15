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
// @access  Public
router.get('/', async(req, res) => {  
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
// @access  Public
router.get('/:id', async(req, res) => {   // :id is a placeholder parameter
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

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById( req.params.id );  // findById method taking req.params.id as an argument

        //Check if the post has already been liked
        if( post.likes.filter(like => like.user.toString() === req.user.id).length > 0 ) {  // likes is an array; user is an ObjectId
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });  // user like goes to front of array

        await post.save();  // saves post

        res.json(post.likes);   // responds with array of likes
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route   PUT api/posts/unlike/:id
// @desc    unLike a post
// @access  Private
router.put('/unlike/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById( req.params.id );  // findById method taking req.params.id as an argument

        // Check if the post has not yet been liked
        if( post.likes.filter(like => like.user.toString() === req.user.id).length === 0 ) {  // likes is an array; user is an ObjectId
            return res.status(400).json({ msg: 'Post has not yet been liked' });
        }

        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id); // get position of user in likes array using map method and indexOf req.user.id

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', 
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

            const post = await Post.findById( req.params.id)
            
            const newComment = {  // declares the new comment and populates the name and avatar values with data from the User document 
                text: req.body.text,
                name: user.name,
                avatar:user.avatar,
                user:req.user.id
            };

            post.comments.unshift(newComment);  // Adds comment to front of comments array 

            await post.save(); 

            res.json(post.comments); // responds with all comments for this post
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// ██╗  ██╗███████╗██████╗ ███████╗
// ██║  ██║██╔════╝██╔══██╗██╔════╝
// ███████║█████╗  ██████╔╝█████╗  
// ██╔══██║██╔══╝  ██╔══██╗██╔══╝  
// ██║  ██║███████╗██║  ██║███████╗
// ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
                                

// @route   POST api/posts/comment/anon/:id
// @desc    Comment on a post as anon
// @access  Public
router.post('/comment/anon/:id', 
    [ // middleware
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
            const user = await User.findById("6028bc674e1e6b580ce2dd46").select('-password');  // declares user which references the user document corresponding to user's token, but doesn't include their password for security reasons

            const post = await Post.findById( req.params.id)
            
            const newComment = {  // declares the new comment and populates the name and avatar values with data from the User document 
                text: req.body.text,
                name: "Anon",
                avatar:user.avatar,
                user:user._id
            };

            post.comments.unshift(newComment);  // Adds comment to front of comments array 

            await post.save(); 

            res.json(post.comments); // responds with all comments for this post
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment on a post
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById( req.params.id );

        // Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        if (!comment) return res.status(404).json({ msg:"Comment does not exist" });

        // Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg:"User not authorized" })
        };

        // Get remove index
        const removeIndex = post.comments
            .map(comment => comment.id === req.params.comment_id)
            .indexOf(true); // get position of comment in comments array using map method and indexOf req.params.comment_id
        
        post.comments.splice(removeIndex, 1);   // splice out comment with remove index

        await post.save();  // saves post as the post with newly spliced comments

        res.json(post.comments); // responds with saved comments
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;