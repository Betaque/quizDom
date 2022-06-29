import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import firebase from '../firebase/firebase'
import LoadingScreen from './LoadingScreen'
import AttemptedModal from './AttemptedModal'
import Timer from "../components/Timer";
import Settings from "../components/Settings";
import SettingsContext from "../components/SettingsContext";
// import SubmitTime from "../components/SubmitTime"
require('dotenv').config()


const AttemptQuiz = ({ match }) => {
	const quizCode = match.params.quizCode
	const [questions, setQuestions] = useState([])
	const [attemptedQuestions, setAttemptedQuestions] = useState([])
	const [quizTitle, setQuizTitle] = useState('')
	const [loading, setLoading] = useState(true)
	const [result, setResult] = useState({})
	const [showModal, setShowModal] = useState(false)
	const uid = firebase.auth().currentUser.uid
	const [qResps , setqResps] = useState([])
	// const [quizStatus, setQuizStatus] = useState(false)
	const [timer,setTimer] = useState(true)
	const [showSettings, setShowSettings] = useState(false);
	// setting the exam time
  	const [workMinutes, setWorkMinutes] = useState(1);
	// const checkRefs = useRef(null)
	const refs = useRef([]);
	refs.current = [];
	const check = (el) =>{
		if(el && !refs.current.includes(el)){
			refs.current.push(el)
		}
		// console.log(checkRefs.current)
		// checkRefs.current.checked=true
	}

	const setOp = (e) =>{
		// console.log("element",e.target)
		
		refs.current.forEach(element => {
			console.log(element.checked)
			// console.log("e2",element.checked)
			// 	console.log("ele",element)
			// if(e.target === element){
			// 	console.log(e.target)
			// 	console.log(element)
			// 	console.log(e.target.checked)
			// 	console.log(element.checked)
			// }
		});
		refs.current.map((val) =>{
			console.log("vvv",val)
		})
	}


	useEffect(() => {

		

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
			if (quizData.error) setQuizTitle(quizData.error)
			else {
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

		const fetchResponses = async () =>{
			console.log("Entered")
			const res = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/fetchResponse`, {
				method: 'POST',
				body: JSON.stringify({ quizId: quizCode, uid }),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			const data = await res.json()
			let arr = []
			data.forEach((element) => {
				// let id = element.id
				// let op = element.selectedOp
				// console.log("ielement",element)
				arr.push(element)
				// setqResps(state => [...state, element])
			});

			setqResps(arr)
		}
		fetchResponses()

	}, [quizCode, uid])

	const handleOptionChecked = (option, index,id) =>{
		// console.log("ocheck",option,id)
		let selected = false
		// console.log("qresps",qResps)
		qResps.forEach((op) =>{
			// console.log("Optsss",op)
			if(op.id === id){
				// console.log(op.id,id)
				op.selectedOp.forEach((ops) =>{
					if(ops === option){
						// console.log("Selected Options Match", ops,option)
						selected = true
					}
				})
			}
		})
		// console.log(selected)

		return selected
	}

	// const resetVal = (val) =>{
	// 	console.log("val",val)
	// }


	const handleOptionSelect = async (e, option, index) => {
		const temp = [...attemptedQuestions]
		const options = temp[index].selectedOptions
		
		if (!options.includes(option) && e.target.checked) {
			if (attemptedQuestions[index].optionType === 'radio') options[0] = option
			else options.push(option)
		}
		if (options.includes(option) && !e.target.checked) {	
			const i = options.indexOf(option)
			options.splice(i, 1)
		}
		console.log("options",options)
		temp[index].selectedOptions = options
		const value = temp[index]
		// console.log("t2",temp[index])
		try {
			const res = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/update`, {
				method: 'POST',
				body: JSON.stringify({
					uid,
					quizId: quizCode,
					questions: value,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			const body = await res.json()
			// setResult(body)
			// setShowModal(true)
			console.log('res body : ', body)
		} catch (e) {
			console.log('Error Submitting quiz', e)
		}

		setAttemptedQuestions(temp)
	}
	console.log("a",attemptedQuestions)
	const submitQuiz = async () => {
		// send attemped Questions to backend
		try {
			// console.log("jii")
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
			setResult(body)
			setShowModal(true)
			console.log('res body : ', body)
		} catch (e) {
			console.log('Error Submitting quiz', e)
		}
	}

	if (loading) return <LoadingScreen />
	// For Quiz not Found
	if (quizTitle === 'ERR:QUIZ_NOT_FOUND'){
		setTimer(false)
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
	}
		
	// For Quiz not accessible
	else if (quizTitle === 'ERR:QUIZ_ACCESS_DENIED'){
		setTimer(false)
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
	}
		
	else if (quizTitle === 'ERR:QUIZ_ALREADY_ATTEMPTED')
		{
			setTimer(false)
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
		}
	else
		return (
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
						{showSettings ? <Settings /> : <Timer />}
					</SettingsContext.Provider>
					</div>
					{questions.map((question, index) => (
						<div className='attempQuestionCard' key={index}>
							<div id='title'>{question.title}</div>
							<div className='option-div'>
								{question.options.map((option, ind) => (
									<div className='option' key={ind}>
										{question.optionType === 'radio' ? (
												<input
												type='radio'
												name={`option${index}`}
												id={question.title+option.text}
												// ref={checkRefs}
												onChange={(e) =>{
													setOp(e)
													handleOptionSelect(e, option.text, index)
													}		
												}
												ref={check}
												checked={
													handleOptionChecked(option.text, index,question.id)
												}
												// onClick={(e)=>setOp(e)}
												// onClick={check}
												
											/>
											
										) : (
											<input
												type='checkbox'
												name='option'
												onChange={(e) =>
													handleOptionSelect(e, option.text, index)
												}
											/>
										)}
										<label className='label' style={{ padding: '0px 5px' }}>
											{option.text}
										</label>
									</div>
								))}
							</div>
							{/* <button onClick={() => resetVal(question)}>reset</button> */}
						</div>
					))}
					<button className='button wd-200' onClick={submitQuiz}>
						Submit
					</button>
					<AttemptedModal
						result={result}
						showModal={showModal}
						totalScore={questions.length}
					/>
				</div>
			</div>
		)
}

export default AttemptQuiz
