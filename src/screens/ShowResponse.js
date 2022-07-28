import React , { useEffect,useState } from 'react'
import ResponseQuestionCard from '../components/ResponseQuestionCard'
// import { useLocation } from 'react-router-dom'
import LoadingScreen from './LoadingScreen'
import { useParams} from 'react-router-dom'
import axios from "axios"

require('dotenv').config()



const ShowQuiz = () => {
	const quizCode = useParams().quizid
	const userCode = useParams().uid
	// const quizCode = match.params.quizid
	// const userCode = match.params.uid
	const [questions, setQuestions] = useState([])
	const [responses, setResponses] = useState([])
	const [quizTitle, setQuizTitle] = useState('')
	const [attemptedQuestions, setAttemptedQuestions] = useState([])
	const [uid,setUid] = useState()
	const [loading, setLoading] = useState(true)
    const [selectedOptions, setSelectedOptions] = useState([])




	useEffect(() => {

		const getUid = () =>{
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
		}
			getUid()
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
			if(result.finalResponse){
				setResponses(result.finalResponse[0])
				setLoading(false)
			}
			
		}
		getResponses()

		// Fetching the Responses of a quiz

			const fetchResponse = async () => {
				const res = await fetch(`http://localhost:8000/API/quizzes/responses/${quizCode}/${userCode}`, {
					method: 'GET'
				})
				const quizData = await res.json()
				if (quizData.error) 
				// console.log("quizData.error",quizData.error)
				setQuizTitle(quizData.error)
				else {
					const temp = quizData.map((question) => {
						return {
								id: question.id,
								selectedOp: question.selectedOp,
								optionId: question.optionId,
								textAns: question.textAns
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


		
		}, [quizCode, userCode, uid])

	
	if (loading) return <LoadingScreen />
		return (
			<div id='main-body'>
				<div id='create-quiz-body'>
					<div className='quiz-header'>
						<h2>Quiz Name : {quizTitle}</h2>
						<div className='detail'>
								<p className='detail-name'><strong>Name: </strong>{responses.name}</p>
								<p className='detail-score'><strong>Score: </strong>{responses.score}</p>
							</div>
					</div>
					{questions.map((question, index) => (
								<ResponseQuestionCard question={question} index={index} quizCode={quizCode} selectedOptions={selectedOptions} userCode={userCode} />
							))}
				</div>
			</div>
		)
}

export default ShowQuiz
