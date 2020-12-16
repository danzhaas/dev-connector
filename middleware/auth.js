const jwt = require('jsonwebtoken');    //has methods to decode and verify jwt's 
const config = require('config');   // can call variables declared elsewhere in the program.  

module.exports = function(req, res, next) { // establishes middleware module parameters.  This gives access to req and res objects, and the 'next' callback moves on to the next piece of middleware.  
    const token = req.header('x-auth-token');   //Get token from header

    if (!token) {  //check if not token
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {  //Verify token
        const decoded = jwt.verify(token, config.get('jwtSecret')); // declares decoded as content of jwt object

        req.user = decoded.user;    // declares req.user as the content of the user key in the decoded jwt object
        next(); //advances to next middleware
    } catch(err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}