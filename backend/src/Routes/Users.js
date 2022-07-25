const express = require('express')
const ObjectId = require('mongodb').ObjectId
const Router = express.Router()
const DB = require('./DB')
const Users = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
const { loginValidator , registerValidator} = require('../validators/validators')

// Create User in DB
Router.post('/create', (req, res) => {
	console.log("entered")
	const { uid, name, email } = req.body
	if (!uid) return res.status(500).json({ error: 'Incomplete Parameters' })

	DB.createUser(uid, name, email, res)
})

// Get user

Router.post('/find', (req, res) => {
	const {id} = req.body
	console.log("iddd",id)
	DB.findUser(id,res)
})

// Router.get('/find/:id', (req,res) =>{
// 	const {id} = req.params
// 	console.log("id from",id)
// 	DB.findUserUid(id,res)
// })

// Get user Data
Router.get('/:uid', (req, res) => {
	const uid = req.params.uid
	if (!uid) return res.status(500).json({ error: 'Incomplete Parameters' })
	console.log("hiii")
	try{
		DB.withDB(async (db) => {
			const createdCursor = await db
				.collection('quizzes')
				.find({ uid })
				.project({
					isOpen: 1,
					title: 1,
					questions: 1,
					responses: {
						$size: '$responses',
					},
				})
			const createdQuiz = await createdCursor.toArray()
			console.log("createdQuiz from users",createdQuiz)
			const userCursor = await db.collection('users').find({ uid }).project({
				attemptedQuiz: 1,
			})
			const userInfo = await userCursor.toArray()
			console.log("user Info",userInfo)
			if (userInfo) {
				console.log("inside userInfo")
				try{
					const attemptedCursor = db
					.collection('quizzes')
					.find({ _id: { $in: userInfo[0].attemptedQuiz } })
					.project({
						title: 1,
						totalQuestions: {
							$size: '$questions',
						},
						responses: { $elemMatch: { uid } },
					})
					const attemptedQuiz = await attemptedCursor.toArray()
					// console.log(attemptedQuiz)
					res.status(200).json({ createdQuiz, attemptedQuiz })
				}catch{
					res.status(200).json({ createdQuiz })
				}
				
			} else {
				console.log("error")
				res.status(200).json({ createdQuiz })
			}
		}, res)
	}catch{
		res.status(404).json({ error: 'Error Occurred' })
	}
	
})


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
                            name: user.name
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
        const {name , collegename , email , password} = req.body;//destructuring all the fields
        const registerUser = new Users({ // here we are making a new data
            name,
            collegename,
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

Router.get('/find/:id', checkAuth ,(req,res) =>{ 
    //here with the help of checkauth we are checking that for accessing the web page the user is signed in or not.
    DB.findUser(req.params.id,res)
})



module.exports = Router
