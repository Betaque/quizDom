import React, { useState, useEffect } from 'react'
import { Link , Redirect} from 'react-router-dom'
import firebase from '../firebase/firebase'
import LoadingScreen from './LoadingScreen'
// import AttemptedModal from './AttemptedModal'
import Timer from "../components/Timer";
import Settings from "../components/Settings";
import SettingsContext from "../components/SettingsContext";
import QuestionCard from "../components/QuestionCard"

require('dotenv').config()


const AttemptQuiz = ({ match }) => {
	const quizCode = match.params.quizCode
	const [questions, setQuestions] = useState([])
	const [attemptedQuestions, setAttemptedQuestions] = useState([])
	const [quizTitle, setQuizTitle] = useState('')
	const [loading, setLoading] = useState(true)
	const [active,setActive] = useState(false)
	// const [submission, setSubmission] = useState(false)
	// const [result, setResult] = useState({})
	const [redirect,setRedirect] = useState(false)
	// const [showModal, setShowModal] = useState(false)
	const uid = firebase.auth().currentUser.uid
	// const [quizStatus, setQuizStatus] = useState(false)
	// const [timer,setTimer] = useState(true)
	const [showSettings, setShowSettings] = useState(false);
	// setting the exam time
  	const [workMinutes, setWorkMinutes] = useState(1);
	// let submission = false

	useEffect(() => {
			try{
				const fetchQuiz = async () => {
					const res = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/join`, {
						method: 'POST',
						body: JSON.stringify({ quizId: quizCode, uid }),
						headers: {
							'Content-Type': 'application/json',
						},
					})
					const quizData = await res.json()
					console.log("quizData",quizData)
					setLoading(false)
					if (quizData.error) {
						console.log("errrorrr")
						setQuizTitle(quizData.error)
					}
					else {
						setActive(true)
						setQuizTitle(quizData.title)
						setQuestions(quizData.questions)
						const temp = quizData.questions.map((question) => {
							return {
								id: question.id,
								title: question.title,
								optionType: question.optionType,
								selectedOptions: [],
							}
						})
						console.log("temp",temp)
						setAttemptedQuestions(temp)
					}
				}
				fetchQuiz()
			}
			catch{
				console.log("Error in fetchQuiz")
			}
		
		
	}, [quizCode, uid])

	// console.log("quizTime",quizTime)


	if(redirect) return <Redirect push to={{pathname:`/result/${quizCode}`, state: {uid: uid}}} />

	const submitQuiz = async () => {
		// send attemped Questions to backend
		console.log("Enteredd the submission")
		try {
			setActive(true)
			const res = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/submit`, {
				method: 'POST',
				body: JSON.stringify({
					uid,
					quizId: quizCode,
					questions: attemptedQuestions,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			const body = await res.json()
			// setResult(body)
			// setShowModal(true)
			console.log('res body : ', body)
			setRedirect(true)
			
		} catch (e) {
			console.log('Error Submitting quiz', e)
		}
	}

	// const quizSubmission = () =>{
	// 	console.log("ENtered the submission")
	// 	submission = true
	// 	console.log(submission)
	// }


	if (loading) return <LoadingScreen />

	// For Quiz not Found
	if (quizTitle === 'ERR:QUIZ_NOT_FOUND')
		return (
			<div className='loading'>
				<h1>404 Quiz Not Found!</h1>
				<div id='logo-name'>
					<b>Quiz</b>dom
				</div>
				<h3>
					Go back to <Link to='/join-quiz'>Join Quiz </Link>Page.
				</h3>
			</div>
		)
	
		
	// For Quiz not accessible
	else if (quizTitle === 'ERR:QUIZ_ACCESS_DENIED')
		return (
			<div className='loading'>
				<h2>
					Quiz Access is Not Granted by the Creator. Please contact Quiz
					Creator.
				</h2>
				<div id='logo-name'>
					<b>Quiz</b>dom
				</div>
				<h3>
					Go back to <Link to='/join-quiz'>Join Quiz </Link>Page.
				</h3>
			</div>
		)
		
	else if (quizTitle === 'ERR:QUIZ_ALREADY_ATTEMPTED')		
			return (
				<div className='loading'>
					<h2>You have already taken the Quiz.</h2>
					<div id='logo-name'>
						<b>Quiz</b>dom
					</div>
					<h3>
						Go back to <Link to='/join-quiz'>Join Quiz </Link>Page.
					</h3>
				</div>
			)
		
	else
		return (
			<>
				{
					active ? 
					<div id='main-body'>
						<div id='create-quiz-body'>
							<div className='quiz-header'>
								<h2>{quizTitle}</h2>
							</div>
						<div>
							<SettingsContext.Provider value={{
								showSettings,
								setShowSettings,
								workMinutes,
								setWorkMinutes
							}}>

								{showSettings ? <Settings /> : <Timer handleChild={(value) => value ? submitQuiz() : ''} />}

							</SettingsContext.Provider>
							</div>
							{questions.map((question, index) => (
								<QuestionCard question={question} index={index} quizCode={quizCode} attemptedQuestions={attemptedQuestions} />
							))}
							{/* <button onChange={submitQuiz} value={submission}  style={{display: "none"}}></button> */}
							<button className='button wd-200' onClick={submitQuiz} 
							// disabled={checkBtn()}
							>
								Submit
							</button>
							{/* <AttemptedModal
								result={result}
								showModal={showModal}
								totalScore={questions.length}
							/> */}
						</div>
					</div>
					: ''
				}
			</>
			
			
		)
}

export default AttemptQuiz
