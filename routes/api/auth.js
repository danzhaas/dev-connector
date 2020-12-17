const express = require ('express');
const router = express.Router();
const auth = require('../../middleware/auth');  // brings in jwt auth middleware
const bcrypt = require('bcryptjs'); // encryption package
const jwt = require('jsonwebtoken');    // js web token
const config = require('config');   //allows us to access other json files 
const { check, validationResult } = require('express-validator'); //the methods for request validation

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

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/',    // route
    [   // second argument is an array in which fields are checked against validators
        check ('email', 'Please include a valid email')
            .isEmail(),
        check ('password', 'Please enter a password with 6 or more characters')
            .exists()
    ],
    async (req, res) => {   //async because this will request promises from the database
        const errors = validationResult(req);   // validationResult contains the array of error messages generated from failed checks above
        if(!errors.isEmpty()) { //if the errors array is not empty
            return res.status(400).json({ errors: errors.array() })  // code 400: bad request, in this case validation failed
        }
            
        const { email, password } = req.body; //deconstruct user fields from the request object

        try {
            
            let user = await User.findOne({ email }); // see if a user with this email exists; 
            if (!user) {  // if user exists, respond with error; 
                return res
                    .status(400)
                    .json({ errors: [ { msg: 'Invalid credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                .status(400)
                .json({ errors: [ { msg: 'Invalid credentials' }] });
            }

            const payload = {   // formats user id for jwt generation
                user: { 
                    id: user.id
                }
            }
            jwt.sign(   // returns token or error asynchronously
                payload, 
                config.get('jwtSecret'),    // this secret is in default.json
                { expiresIn:360000 },   //how long in SECONDS the token will be valid
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });    // sends token to user
                }
            );

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        };
    }
);

module.exports = router;