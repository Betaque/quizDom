const {MongoClient} = require('mongodb')
const Evaluate = require('../Algorithms/EvaluateQuiz')
const Answers = require('../Algorithms/AnswerQuiz')
const { CodeSharp } = require('@material-ui/icons')
const ObjectId = require('mongodb').ObjectId
const API_KEY = require('../db-config').database
let db

const DB = 'mongodb+srv://verma0018:qwerty%4018@cluster0.sdcnj.mongodb.net/quizDom?retryWrites=true&w=majority'

const DBStart = async () => {
	console.log('DB server connecting...')
	const client = await MongoClient.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	console.log('DB Connected Successfully.')
	db = client.db('quizDom-bq')
	// console.log(db.collection('quizzes'))
}
DBStart()


const withDB = async (operations, res) => {
	try {
		await operations(db)
		// client.close()
	} catch (error) {
		console.log('Error connecting to DB : ', error)
		res.status(500).json({ message: 'Error Connecting to db ', error })
	}
}

const createUser = async (data,res) => {
	try{
		const {firstName , lastName , email , password , createdAt , deleted } = data
		console.log("creating a user")
		console.log("data",data._id)
		const uid = data._id
		console.log("createUser",data)
		await withDB(async (db) => {
			const user = await db.collection('users').findOne({ uid: uid })
			// console.log(user)
			if (!user) {
				console.log("Entered creating user")
				const result = await db.collection('users').insertOne({
					uid,
					firstName , 
					lastName , 
					email , 
					password , 
					createdAt , 
					deleted ,
					createdQuiz: [],
					attemptedQuiz: []
				})
				res.status(200).json({ message: 'User Created successfully.' })
			} else {
				res.status(200).json({ message: 'User Record Exist' })
			}
		})
	}
	catch{
		res.status(404).json({ message: 'Error Occurred' })
	}
}

const getUser = async (uid,res) =>{
	await withDB(async(db) => {
		const user = await db.collection('users').findOne({ uid: uid })
		// console.log(user)
	}
)}

createQuiz = async (quiz, res) => {
	try {
		await withDB(async (db) => {
			quiz['responses'] = []
			const result = await db.collection('quizzes').insertOne(quiz)
			res.status(200).json({
				message: 'Quiz created successfully',
				quizId: result.insertedId
			})
			console.log('quiz ID', result.insertedId)
			const query = { uid: quiz.uid }
			const addQuiz = {
				$push: { createdQuiz: result.insertedId }
			}
			await db.collection('users').updateOne(query, addQuiz)
			console.log('Quiz Added to Creator Document: ', result.insertedId)
		})
	} catch (error) {
		res.status(200).json({ message: 'Error creating quiz', error })
		console.log('Error : ', error)
	}
}

// const updateText = async (updateText, res) =>{
// 	withDB(async(db) =>{
// 		try{

// 		}
// 		catch{
// 			console.log("Error Submitting the text!")
// 		}
// 	})
// }


const updateQuiz = async (updatedQuiz,res) =>{
	withDB(async (db) => {
		try {
		// Check whether the user has already submitted the Quiz
			console.log("updatedQuiz",updatedQuiz)
			const validationCursor = db.collection('users').find({
				$and: [
					{ uid: updatedQuiz.uid },
					{ attemptedQuiz: updatedQuiz.quizId }
				]
			})
			const quizData = await validationCursor.toArray()
			// If the quiz is already submitted, DONOT submit it.
			if (quizData[0]) {
				console.log('in quiz already attempted')
				return res.status(200).json({
					error: 'ERR:QUIZ_ALREADY_ATTEMPTED'
				})
			}
			console.log("updatedQuiz",updatedQuiz)
			// console.log("optionsId",updatedQuiz.optionId)
			const id = updatedQuiz.questions.id
			const optionId = updatedQuiz.optionId
			
			const sop = updatedQuiz.questions.selectedOptions
			let reply = [{"id":id,"selectedOp":sop, "optionId": optionId}]
			if(updatedQuiz.opType === 'text'){
				reply = {"id":id,"textAns": updatedQuiz.message}
			}
			const vid = await db.collection('responses').find({_id:updatedQuiz.quizId})
			const quiz = await vid.toArray()
			console.log("length",quiz[0])
			if(quiz[0] != undefined){
				console.log("rrrrrrrr",quiz[0])
				const arrayResponses = quiz[0].responses
				function checkId(resp){
					let item = resp.map((resps) => {
						if(resps.id == updatedQuiz.questions.id){
							console.log("found")
							return true
						}
					}).filter(function(resps){return resps;})[0];
					return item
				}
				const returnedVal = checkId(arrayResponses);
				console.log("Returned Val",returnedVal)
				if(returnedVal){
					let i=0
					console.log("This question exists")
					console.log("arrayResponses",arrayResponses)
					arrayResponses.forEach(async (res) => {
						if(res.id == updatedQuiz.questions.id){
							console.log("idval",i)
							let deletedOb = arrayResponses[i]
							await db.collection('responses').updateOne(
								{ 
									_id: updatedQuiz.quizId,
									uid: updatedQuiz.uid
								},
								{
									$pull: {
										responses: { $in: [deletedOb] }
									}
								}
							) 
							let reply = {"id":id,"selectedOp":sop, "optionId": optionId}
							if(updatedQuiz.opType === 'text'){
								reply = {"id":id,"textAns": updatedQuiz.message}
							}
							console.log("rrrr",reply)
							await db.collection('responses').updateOne(
								{ 
									_id: updatedQuiz.quizId,
									uid: updatedQuiz.uid
								},
								{ $push: { responses: reply } }
							 )
						}
						i++
					});

				}else{
					let reply = {"id":id,"selectedOp":sop, "optionId": optionId}
					if(updatedQuiz.opType === 'text'){
						reply = {"id":id,"textAns": updatedQuiz.message}
					}
					await db.collection('responses').updateOne(
						{ 
							_id: updatedQuiz.quizId,
							uid: updatedQuiz.uid
						},
						{ $push: { responses: reply } }
					 )
				}
			}else{
				console.log("This quiz does not exists")
				await db.collection('responses').insertOne(
					{	
						_id: updatedQuiz.quizId,
						uid: updatedQuiz.uid, 
						responses: reply 
					}
				)
			}	
		}
		catch (error){
			console.log(error)
		}
	})
}

submitQuiz = async (submittedQuiz, res) => {
	withDB(async (db) => {
		try {
			// Check whether the user has already submitted the Quiz
			const validationCursor = db.collection('users').find({
				$and: [
					{ uid: submittedQuiz.uid },
					{ attemptedQuiz: ObjectId(submittedQuiz.quizId) }
				]
			})

			const quizData = await validationCursor.toArray()
			console.log({ quizData })
			console.log("dbquiz",quizData)
			console.log("submittedQuiz",submittedQuiz.questions)
			// If the quiz is already submitted, DONOT submit it.
			if (quizData[0]) {
				console.log('in quiz already attempted')
				return res.status(200).json({
					error: 'ERR:QUIZ_ALREADY_ATTEMPTED'
				})
			}
			const cursor = await db
				.collection('quizzes')
				.find({ _id: new ObjectId(submittedQuiz.quizId) })
				.project({ questions: 1 })
			const quiz = await cursor.toArray()
			const score = Evaluate(quiz[0].questions, submittedQuiz.questions)
			// const reply = Answers(quiz[0].questions, submittedQuiz.questions)
			res.status(200).json({ score })

			// Update in quizzes responses
			await db.collection('quizzes').updateOne(
				{ _id: new ObjectId(submittedQuiz.quizId) },
				{
					$push: {
						responses: { uid: submittedQuiz.uid, score: score }
					}
				}
			)

			await db.collection('users').updateOne(
				{ uid: submittedQuiz.uid },
				{
					$push: {
						attemptedQuiz: ObjectId(submittedQuiz.quizId)
					}
				}
			)
			// await db.collection('responses').insertOne(
			// 	{	
			// 		_id: submittedQuiz.quizId,
			// 		uid: submittedQuiz.uid, 
			// 		score: score,
			// 		responses: reply 
			// 	}
			// )
			// Update user's attempted quizzes
			
		} catch (error) {
			console.log('Error:', error)
			res.status(500).json({ error })
		}
	})
}

const getModals = (user,qid,res) =>{
	console.log("qid",qid)
	try{
		withDB(async (db) =>{
			const cursor = db.collection('quizzes').find({_id: new ObjectId(qid)})
			// console.log("cursor",cursor)
			const cursorData = await cursor.toArray()
			// console.log("cursorData",cursorData)
			const responses = cursorData[0].responses
			let found = false
			responses.forEach(resps => {
				console.log("resps",resps.uid)
				console.log("user",user)
				if(resps.uid === user.user.uid){
					console.log("found")
					found = true
				}
			});
			
			found ? res.json({val: true}) : res.json({val: false})
			console.log("resppss",responses)
		},res)
	}
	catch{
		console.log("error occured",err)
	}
	
}


const getResponses = (obj, res) => {
	withDB(async (db) => {
		const cursor = db
			.collection('quizzes')
			.find({ _id: new ObjectId(obj.quizCode), uid: obj.uid })
			.project({ responses: 1 })
		const cursorData = await cursor.toArray()
		const responses = cursorData[0].responses
		const uidList = responses.map((response) => response.uid)
		// console.log(uidList)
		// console.log(responses)
		const cursor2 = db
			.collection('users')
			.find({ uid: { $in: uidList } })
			.project({ uid: 1, name: 1, email: 1 })

		const cursor2Data = await cursor2.toArray()
		const finalResponse = []
		cursor2Data.forEach((data) => {
			let index = responses.findIndex((resp) => resp.uid === data.uid)
			finalResponse.push({
				name: data.name,
				email: data.email,
				score: responses[index].score
			})
		})
		res.status(200).json({ finalResponse })
	}, res)
}

const getQuizResponse = (qid,uid,res) =>{
	try{
		withDB(async (db) => {
			const cursor = db
				.collection('responses')
				.find({ _id: qid, uid: uid})
				.project({ responses: 1, optionId: 1 })
			const cursorData = await cursor.toArray()
			const responses = cursorData[0].responses
			const reply = responses.map((response) => response)
			// console.log("Cursor Data Quiz Response", cursorData)
			console.log("Reply",reply)
			res.status(200).json(reply)
		},res)
	}
	catch{
		console.log("Try the id")
	}
}

module.exports.withDB = withDB
module.exports.updateQuiz = updateQuiz
module.exports.createUser = createUser
module.exports.getUser = getUser
module.exports.getModals = getModals
module.exports.createQuiz = createQuiz
module.exports.submitQuiz = submitQuiz
module.exports.getResponses = getResponses
module.exports.getQuizResponse = getQuizResponse
