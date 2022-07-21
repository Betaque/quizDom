const express = require('express')
const Users = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
const { loginValidator , registerValidator} = require('../validators/validators')
const DB = require('./DB')


const Router = express.Router();

// For logging in

Router.post('/login', (req,res) =>{
    const {email , password} = req.body
    const {errors , isValid} = loginValidator(req.body) //here we are checking the validations
    if(!isValid){ //getting the validity check
        res.json({success: false, errors});
    }else{

        DB.getUser(email).then(user=>{ //finding an element from the data base using the mail id
            if(!user){ //if user does not exists
                res.json({message: "Email does not exist", success: false});
            }else{
                bcrypt.compare(password, user.password).then(success =>{ //if user exists then we compare the password provided and the password stored in the database
                    if(!success){
                        res.json({message: "Invalid Password", success: false});//If we get dont get the succes in doing this.
                    }else{//If we get the succes in validating properly
                        const payload = {
                            id: user._id,
                            name: user.firstName
                        }
                        console.log("process",process.env.APP_SECRET)
                        jwt.sign(payload, process.env.APP_SECRET, {expiresIn: 2155926},
                            (err,token) =>{
                                res.json({
                                    user,
                                    token: 'Bearer token: ' + token,
                                    success:true
                                })
                            })
                    }
                })
            }
        })
    }
})

// For registering new user

Router.post('/register', (req,res) => {
    console.log("register")
    console.log("data",req.body)
    const {errors , isValid} = registerValidator(req.body);//registering validation
    if(!isValid){
        res.json({success: false, errors});
    }else{ //if the validation is done properly then go ahead
        const {firstName , lastName , email , password} = req.body;//destructuring all the fields
        const registerUser = new Users({ // here we are making a new data
            firstName,
            lastName,
            email,
            password,
            createdAt: new Date()
        });
        console.log(registerUser)
        bcrypt.genSalt(10, (err, salt) =>{ //generating the hash for the password
            bcrypt.hash(registerUser.password, salt, (hashErr, hash) =>{
                if(err || hashErr){ //if any error occurred during this proccess
                    res.json({message: 'Error Occured during hashing', success:false})
                    return
                }
                registerUser.password = hash; // assigning the datas password as hash
                DB.createUser(registerUser,res)
            })
        })
    }
})


// Getting the element only when you are logged in

Router.get('/:id', checkAuth ,(req,res) =>{ 
    //here with the help of checkauth we are checking that for accessing the web page the user is signed in or not.
    DB.findUser(req.params.id,res)
})

module.exports = Router;