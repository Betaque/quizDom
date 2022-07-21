const express = require('express')
const ObjectId = require('mongodb').ObjectId
const Router = express.Router()
const DB = require('./DB')

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
			const userCursor = await db.collection('users').find({ uid }).project({
				attemptedQuiz: 1,
			})
			const userInfo = await userCursor.toArray()
			// console.log(userInfo)
			if (userInfo) {
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
			} else {
				console.log("error")
				res.status(200).json({ createdQuiz })
			}
		}, res)
	}catch{
		res.status(404).json({ error: 'Error Occurred' })
	}
	
})

module.exports = Router
