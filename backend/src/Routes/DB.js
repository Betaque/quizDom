const {MongoClient} = require('mongodb')
const Evaluate = require('../Algorithms/EvaluateQuiz')
const Answers = require('../Algorithms/AnswerQuiz')
const { CodeSharp } = require('@material-ui/icons')
const { json } = require('body-parser')
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
		const {name , collegename , email , password , createdAt , deleted } = data
		const val = data._id
		const uid = val.toString()
		console.log("createUser",data)
		await withDB(async (db) => {
			const user = await db.collection('users').findOne({ email: email })
			if (!user) {
				const result = await db.collection('users').insertOne({
					uid,
					name , 
					collegename , 
					email , 
					password , 
					createdAt , 
					deleted ,
					createdQuiz: [],
					attemptedQuiz: []
				})
				res.status(200).json({ message: 'User Created successfully.' , success: true})
			} else {
				res.status(200).json({ message: 'User Record Exist' , success: false})
			}
		})
	}
	catch{
		res.status(404).json({ message: 'Error Occurred' , success: false})
	}
}

getUser = async (email) =>{
	let user
	await withDB(async(db) => {
			user = await db.collection('users').findOne({ email: email })
			console.log("user",user)
			
		})
	return user
}

findUser = async (id,res) =>{
	try{
		await withDB(async(db) =>{
			const user = await db.collection('users').findOne({_id : new ObjectId(id)})
			res.status(200).json({message: "Found User", success: true, user: user})
		})
	}catch{
		res.status(200).json({message: "User Not Found", success:false})
	}
}
findUserUid = async (id,res) =>{
	try{
		await withDB(async(db) =>{
			const user = await db.collection('users').findOne({uid: id})
			res.status(200).json({message: "Found User", success: true, user: user})
		})
	}catch{
		res.status(200).json({message: "User Not Found", success:false})
	}
}

createQuiz = async (quiz, res) => {
	try {
		await withDB(async (db) => {
			quiz['responses'] = []
			const result = await db.collection('quizzes').insertOne(quiz)
			res.status(200).json({
				message: 'Quiz created successfully',
				quizId: result.insertedId
			})
			console.log("quiz uid",quiz.uid)

			const val = await db.collection('users').updateOne(
				{uid : quiz.uid}, 
				{
					$push: { createdQuiz: result.insertedId }
				}
			)
			console.log('Quiz Added to Creator Document: ', result.insertedId)
		})
	} catch (error) {
		res.status(200).json({ message: 'Error creating quiz', error })
		console.log('Error : ', error)
	}
}



const updateQuiz = async (updatedQuiz,res) =>{
	withDB(async (db) => {
		try {
		// Check whether the user has already submitted the Quiz
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
			const id = updatedQuiz.questions.id
			const optionId = updatedQuiz.optionId
			
			const sop = updatedQuiz.questions.selectedOptions
			let reply = [{"id":id,"selectedOp":sop, "optionId": optionId}]
			if(updatedQuiz.opType === 'text'){
				reply = {"id":id,"textAns": updatedQuiz.message}
			}
			const vid = await db.collection('responses').find({_id:updatedQuiz.quizId})
			const quiz = await vid.toArray()
			if(!updatedQuiz.optionId){
				if(quiz[0] != undefined){
					let arrayResponses = quiz[0].responses
						arrayResponses.forEach(async (arr) =>{
							if(arr.id === updatedQuiz.questions){
								await db.collection('responses').updateOne(
									{ 
										_id: updatedQuiz.quizId,
										uid: updatedQuiz.uid
									},
									{
										$pull: {
											responses: { $in: [arr] }
										}
									}
								) 
							}
						})
				}
				return res.json({value : "Going correct"})
			}
			console.log("------------------------------------------------------")

			if(quiz[0] != undefined){
				const arrayResponses = quiz[0].responses
				function checkId(resp){
					let item = resp.map((resps) => {
						if(resps.id == updatedQuiz.questions.id){
							return true
						}
					}).filter(function(resps){return resps;})[0];
					return item
				}
				const returnedVal = checkId(arrayResponses);
				if(returnedVal){
					let i=0
					// console.log("This question exists")
					// console.log("arrayResponses",arrayResponses)
					arrayResponses.forEach(async (res) => {
						if(res.id == updatedQuiz.questions.id){
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
			console.log("Score",score)
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
			const cursorData = await cursor.toArray()
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
		let uidList = responses.map((response) => response.uid)
		console.log(uidList)
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
		console.log("final response",finalResponse)
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
module.exports.findUser = findUser
module.exports.findUserUid = findUserUid
module.exports.getModals = getModals
module.exports.createQuiz = createQuiz
module.exports.submitQuiz = submitQuiz
module.exports.getResponses = getResponses
module.exports.getQuizResponse = getQuizResponse
