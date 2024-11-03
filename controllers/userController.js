const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler( async (req, res)=>{
    
   
    const {username, email, password} = req.body;
    //if any field is empty
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatary");
    }

    //if a username already exists
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("email already exists");
    }
    
    //Paswword hashing using bcrypt, as we cannot store passwords in raw form for security purposes
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Pass: ", hashedPassword);
    
    //else create a new user
    const user = await User.create({
        username, 
        email, 
        password : hashedPassword,
    })
    
    console.log(`User created ${user}`);
    //get informed to the user that account has been created
    if(user){
        res.status(201).json({
            _id: user.id,
            email : email,
        })
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }

    res.json({
        message: "Register the user"
    });


})

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler( async (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    //we have to find wheter there is a user in the database or not
    const user = await User.findOne({email});
    //compare password with hashedpassword
    if(user && (await bcrypt.compare(password, user.password))) {
        //we meed to provide with the access token , which will be done using jwt
        const accessToken = jwt.sign({
            //As you can see in the website, jwt has a payload
            user :{
                username : user.username,       
                email : user.email,
                id : user.id,
            },
        } , 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : "15m"}
    );

        res.status(200).json({ accessToken });

    }
    else{
        res.status(401);
        throw new Error("Email or password is not valid");
    }
    // res.json({
    //     message: "Login the user"
    // });
})

//@desc get current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler (async (req, res)=>{
    res.json(req.user);
})

module.exports = {registerUser, loginUser, currentUser};