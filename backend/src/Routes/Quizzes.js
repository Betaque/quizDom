const express = require('express')
const Router = express.Router()
const DB = require('./DB')
const ObjectId = require('mongodb').ObjectId
const axios = require('axios')
const timer = require('../Algorithms/TimerSystem')

// Middleware

const validateUser = async (req,res,next) =>{
	req.body.uid == "KYf42ETgJkQHyomXwiUG4YPEvb93" ? next() : res.json({"message":"unauthorized"})  
}


// Get Quiz Data
Router.post('/join', (req, res) => {
	console.log("requestssssssssss",req.body)
	const { quizId, uid } = req.body
	if (!quizId || !uid)
		return res.status(500).json({ error: 'Incomplete Parameters' })

	DB.withDB(async (db) => {
		try {
			const cursor = db
				.collection('quizzes')
				.find({ _id: new ObjectId(quizId) })
				.project({
					// Excluded Fields
					responses: 0,
					'questions.options.isCorrect': 0,
				})

			const quizData = await cursor.toArray()
			// console.log("quizData",quizData)
			if (!quizData[0].isOpen)
				res.status(500).json({ error: 'ERR:QUIZ_ACCESS_DENIED' })
			else {
				const cursor2 = db.collection('users').find({
					$and: [{ uid }, { attemptedQuiz: ObjectId(quizId) }],
				})

				const quiz2 = await cursor2.toArray()
				// console.log('quiz 2 : ', quiz2)
				if (quiz2[0]) {
					console.log('in quiz already attempted')
					res.status(200).json({
						error: 'ERR:QUIZ_ALREADY_ATTEMPTED',
					})
				} else res.status(200).json(quizData[0])
			}
		} catch (error) {
			res.status(500).json({ error: 'ERR:QUIZ_NOT_FOUND' })
		}
	}, res)
})

Router.post('/getres', (req,res) =>{
	const { quizId, uid } = req.body
	if (!quizId || !uid)
		return res.status(500).json({ error: 'Incomplete Parameters' })

		DB.withDB(async (db) => {
			try {
				const cursor = db
					.collection('quizzes')
					.find({ _id: new ObjectId(quizId) })
					.project({
						// Excluded Fields
						responses: 0
						// 'questions.options.isCorrect': 0,
					})
	
				const quizData = await cursor.toArray()
				console.log("quizDataaaaaaaaaaa",quizData)
				const cursor2 = db.collection('users').find({
					$and: [{ uid }, { attemptedQuiz: ObjectId(quizId) }],
				})
				const quiz2 = await cursor2.toArray()
				res.status(200).json(quizData[0])
				
			} catch (error) {
				res.status(500).json({ error: 'ERR:QUIZ_NOT_FOUND' })
			}
		}, res)
})

// Get the responses that are submitted ontime

Router.post('/fetchResponse', (req,res) =>{
	const { quizId, uid } = req.body;
	if (!quizId || !uid)
		return res.status(500).json({ error: 'Incomplete Parameters' })
	
		DB.withDB(async (db) => {
			try {
				const cursor = db
					.collection('responses')
					.find({ _id: quizId, uid: uid })
				// console.log("cursor",cursor)
				const quizData = await cursor.toArray()
				// console.log("quizDataaaaaaaaaaa",quizData[0].responses)
				// const cursor2 = db.collection('users').find({
				// 	$and: [{ uid }, { attemptedQuiz: ObjectId(quizId) }],
				// })
				// const quiz2 = await cursor2.toArray()
				res.status(200).json(quizData[0].responses)
			} catch (error) {
				res.status(500).json({ error: 'ERR:QUIZ_NOT_FOUND' })
			}
		}, res)
})

// Submit the quiz
Router.post('/submit', (req, res) => {
	const quiz = req.body
	console.log("hii")
	if (!quiz) return res.status(500).json({ error: 'Incomplete Parameters' })
	// console.log("quiz response",quiz)
	DB.submitQuiz(quiz, res)
})

// Update options

Router.post('/update', (req,res) =>{
	const update = req.body
	console.log("update",update)
	DB.updateQuiz(update, res)
})

// Create Quiz
Router.post('/create', validateUser, (req, res) => {
	console.log("hellloooooooooooo")
	const quiz = req.body
	// console.log(quiz)
	if (!quiz) return res.status(500).json({ error: 'Incomplete Parameters' })

	quiz.questions.forEach((question, i) => {
		question['id'] = i + 1
	})
	quiz.questions.forEach((question) =>{
		question.options.forEach((option,j) =>{
			option['id'] = j + 1
		})
	})
	DB.createQuiz(quiz, res)
})

Router.post('/edit', validateUser, (req, res) => {
	const { quizId, uid, title, questions, isOpen } = req.body

	DB.withDB(async (db) => {
		try {
			await db.collection('quizzes').updateOne(
				{
					$and: [{ uid }, { _id: ObjectId(quizId) }],
				},
				{
					$set: {
						title,
						questions,
						isOpen,
					},
				},
				(err, result) => {
					if (err) throw err
					res.status(200).json({
						message: 'Quiz Updated Successfully.',
					})
				}
			)
		} catch (error) {
			res.status(500).json({ error })
		}
	})
})

Router.post('/responses', validateUser, (req, res) => {
	const reqBody = req.body
	console.log('Req Body : ', reqBody)
	DB.getResponses(reqBody, res)
})

Router.get('/responses/:quizid/:uid', (req,res) =>{
	const {quizid,uid} = req.params
	DB.getQuizResponse(quizid,uid,res)
})
Router.get('/remaining_time', (req,res) =>{
	let time = {"minute": 1, "seconds": 0}
	timer.evaluate(time)
	res.json({time})
})

Router.post('/modals', (req,res) =>{
	const {user,qid} = req.body
	console.log("Something is going to happen soon!!!")
	console.log(user,qid)
	DB.getModals(user,qid,res)
})

Router.get("/gettime", (req,res) =>{
	let time = timer.sendTime()
	console.log("t",time)
	res.json({time})
})
module.exports = Router
