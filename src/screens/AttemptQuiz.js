import React, { useState, useEffect } from 'react'
import { Link , useNavigate , useParams} from 'react-router-dom'
import LoadingScreen from './LoadingScreen'
// import AttemptedModal from './AttemptedModal'
import Timer from "../components/Timer";
import Settings from "../components/Settings";
import SettingsContext from "../components/SettingsContext";
import QuestionCard from "../components/QuestionCard"
import TimeUp from "../components/TimeUp"
import axios from "axios"

require('dotenv').config()


const AttemptQuiz = (props) => {
	const {quizCode} = useParams()
	const [questions, setQuestions] = useState([])
	const [attemptedQuestions, setAttemptedQuestions] = useState([])
	const [quizTitle, setQuizTitle] = useState('')
	const [loading, setLoading] = useState(true)
	const [active,setActive] = useState(false)
	const [uid,setUid] = useState()
	// const [result, setResult] = useState({})
	const [redirect,setRedirect] = useState(false)
	const [showModal, setShowModal] = useState(false)
	// const [quizStatus, setQuizStatus] = useState(false)
	// const [timer,setTimer] = useState(true)
	const [showSettings, setShowSettings] = useState(false);
	// setting the exam time
  	const [workMinutes, setWorkMinutes] = useState(1);
	let navigate = useNavigate();
	// let submission = false

	useEffect(() => {
			try{
				if(localStorage.getItem('_ID')){
					let id = localStorage.getItem('_ID')
					axios.get(`${process.env.REACT_APP_HOST}/API/users/find/${id}`,{
						headers: {
							authorization: localStorage.getItem('JWT_PAYLOAD')
						  }
					}).then(res => {
						setUid(res.data.user.uid)
					}).catch((er) => {
					  console.log(er)
					})
				  }
				const fetchQuiz = async () => {
					const res = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/join`, {
						method: 'POST',
						body: JSON.stringify({ quizId: quizCode, uid }),
						headers: {
							'Content-Type': 'application/json',
						},
					})
					const quizData = await res.json()
					setLoading(false)
					if (quizData.error) {
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
						setAttemptedQuestions(temp)
					}
				}
				fetchQuiz()
			}
			catch{
				console.log("Error in fetchQuiz")
			}
		
		
	}, [quizCode, uid])


	


	if(redirect) {
		navigate(`/result/${quizCode}` , {state: {uid: uid}})
		navigate(0)
	}
	// <Navi push to={{pathname:`/result/${quizCode}`, state: {uid: uid}}} />

	const submitQuiz = async () => {
		// send attemped Questions to backend
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
			await res.json()
			setRedirect(true)
			
		} catch (e) {
			console.log('Error Submitting quiz', e)
		}
	}



	if (loading) return <LoadingScreen />

	const submission = () =>{
		setShowModal(true)
	}
	if(showModal){
		return <TimeUp submitQuiz={submitQuiz}/>
	}

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
					<div id='main-body-attempt'>
						<div id='create-quiz-body'>
							<div className='quiz-header'>
								<h2>{quizTitle}</h2>
							</div>
							
							{questions.map((question, index) => (
								<QuestionCard question={question} index={index} quizCode={quizCode} attemptedQuestions={attemptedQuestions} setAttemptedQuestions={setAttemptedQuestions} />
							))}
							<button className='button wd-200' onClick={submitQuiz} 
							>
								Submit
							</button>
							
						</div>
						<SettingsContext.Provider value={{
								showSettings,
								setShowSettings,
								workMinutes,
								setWorkMinutes
							}}>

								{showSettings ? <Settings /> : <Timer handleChild={(value) => value ? submission() : ''} />}

							</SettingsContext.Provider>
					</div>
					: ''
				}
			</>
			
			
		)
}

export default AttemptQuiz
