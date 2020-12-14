const express = require ('express');
const router = express.Router();
const gravatar = require ('gravatar');  // user avatar database
const bcrypt = require('bcryptjs'); // encryption package
const jwt = require('jsonwebtoken');    // js web token
const config = require('config');   //allows us to access other json files 
const { check, validationResult } = require('express-validator'); //the methods for request validation

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register route
// @access  Public
router.post(
    '/',    // route
    [   // second argument is an array in which fields are checked against validators
        check ('name', 'Name is required')
            .not()
            .isEmpty(),
        check ('email', 'Please include a valid email')
            .isEmail(),
        check ('password', 'Please enter a password with 6 or more characters')
            .isLength({ min: 6 }),
    ],
    async (req, res) => {   //async because this will request promises from the database
        const errors = validationResult(req);   // validationResult contains the array of error messages generated from failed checks above
        if(!errors.isEmpty()) { //if the errors array is not empty
            return res.status(400).json({ errors: errors.array() })  // code 400: bad request, in this case validation failed
        }
            
        const { name, email, password } = req.body; //deconstruct user fields from the request object

        try {
            
            let user = await User.findOne({ email }); // see if a user with this email exists; 
            if (user) {  // if user exists, respond with error; 
                return res.status(400).json({ errors: [ { msg: 'User already exists' }] });
            }
            
            const avatar = gravatar.url(email, {  // get user's gravatar registered to their email; 
                s: '200',   //size in px
                r: 'pg',    //rating.  pg "may contain rude gestures, provocatively dressed individuals, the lesser swear words, or mild violence."
                d: 'mm'     // default: mm stands for a default "mystery man"
            })

            user = new User({   //create a new User document in the DB containing the posted
                name,
                email,
                avatar,
                password    // note: unencrypted.  This needs to be fixed right away.
            })
            
            const salt = await bcrypt.genSalt(10); // Encrypt password part 1: generate salt with 10 digits; 
            user.password = await bcrypt.hash(password, salt);  // Encrypt password part 2: generate the hashed password;

            await user.save();  //actually save the user document to the DB.  user is updated to match saved document object,  with the above fields plus _id, date, and __v
            
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