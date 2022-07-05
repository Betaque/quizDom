import React , { useEffect,useState } from 'react'
// import { useLocation } from 'react-router-dom'
import firebase from '../firebase/firebase'
import LoadingScreen from './LoadingScreen'
require('dotenv').config()



const ShowQuiz = ({ match }) => {
	// const location = useLocation()
	// const from = location.state.from
	// console.log("from",from)
	// useEffect(() =>{
	// 	fetch('http://localhost:8000/API/quizzes/responses/6298baaaf056871b988a586d/z6c7y5wUSZM4iPohVfrvII5EuTk2')
	// 	.then(response => console.log("Res from show response",response.json()))
	// 	// console.log("Res from show response",res)
	// })
	const quizCode = match.params.quizid
	const userCode = match.params.uid
	const [questions, setQuestions] = useState([])
	const [responses, setResponses] = useState([])
	const [quizTitle, setQuizTitle] = useState('')
	const [attemptedQuestions, setAttemptedQuestions] = useState([])
	const uid = firebase.auth().currentUser.uid
	const [loading, setLoading] = useState(true)
	const [selectedOptions, setSelectedOptions] = useState([])




	useEffect(() => {
		//629df8f2969c4e06907dc706/z6c7y5wUSZM4iPohVfrvII5EuTk2

		// Fetching the Student Details
		const getResponses = async () => {
			const res = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/responses`, {
				method: 'POST',
				body: JSON.stringify({ quizCode: quizCode, uid }),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			const result = await res.json()
			console.log("resssuulltt",result)
			setResponses(result.finalResponse)
			setLoading(false)
		}
		getResponses()

		// Fetching the Responses of a quiz

			const fetchResponse = async () => {
				const res = await fetch(`http://localhost:8000/API/quizzes/responses/${quizCode}/${userCode}`, {
					method: 'GET'
				})
				const quizData = await res.json()
				console.log("quizData",quizData)
				// setLoading(false)
				if (quizData.error) console.log("quizData.error",quizData.error)
				// setQuizTitle(quizData.error)
				else {
					const temp = quizData.map((question) => {
						return {
								id: question.id,
								selectedOp: question.selectedOp,
								optionId: question.optionId
							}
						})
					setSelectedOptions(temp)
				}
			}

			// Fetching the Quiz
			
			const fetchQuiz = async () => {
			const res = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/getres`, {
				method: 'POST',
				body: JSON.stringify({ quizId: quizCode, uid }),
				headers: {
					'Content-Type': 'application/json',
				},
			})

			const quizData = await res.json()
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
		fetchResponse()
		console.log("final response",responses)
		}, [quizCode, userCode, uid])


		const getClass = (val,qindex) => {
			let checking = val.isCorrect
			for(let i = 0; i<selectedOptions.length ; i++){

				if(qindex === selectedOptions[i].id){
					if(val.id === selectedOptions[i].optionId){
						return (checking === "true" ? 'label green bold' : 'label red bold')
					}
					else{
						return (checking === "true" ? 'label green': 'label red')
					}

				}
			}
		}
	
	if (loading) return <LoadingScreen />
		return (
			<div id='main-body'>
				<div id='create-quiz-body'>
					<div className='quiz-header'>
						<h2>{quizTitle}</h2>
						<div className='name'>
								<p><strong>Name: {responses[0].name}</strong></p>
								<p><strong>Score: {responses[0].score}</strong></p>
							</div>
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
												disabled
											/>
										) : (
											<input
												type='checkbox'
												name='option'
												disabled
											/>
										)}
										<label className={getClass(option,question.id)} style={{ padding: '0px 5px' }}>
											{option.text}
										</label>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		)
}

export default ShowQuiz
