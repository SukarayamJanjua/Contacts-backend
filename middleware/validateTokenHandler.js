const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");


const validateToken = asyncHandler(async(req, res, next) =>{
    //first of all acessing the access token from Header>Authorization
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        //to verify this token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, decoded) =>{
            if(err){
                res.status(401);
                throw new Error("User is not authorized");
            }
            req.user = decoded.user;
            next();
        } );

        if(!token){
            res.status(401);
            throw new Error("User is not authorized or token is missing");
        }
    }


})

module.exports = validateToken;