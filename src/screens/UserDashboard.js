import React, { useState, useEffect } from 'react'
import './UserDashBoard.css'
import CreatedQuizCard from '../components/CreatedQuizCard'
import JoinedQuizCard from '../components/JoinedQuizCard'
import LoadingScreen from './LoadingScreen'
import CreateQuiz from './CreateQuiz'
// import OneTimeDashBoard from './OneTimeDashboard'
// import { Navigate } from 'react-router-dom'
import {useNavigate} from "react-router-dom"
import axios from "axios"
require('dotenv').config()

const UserDashboard = ({ user }) => {
	const [createdQuizzes, setCreatedQuizzes] = useState([])
	const [attemptedQuizzes, setAttemptedQuizzes] = useState([])
	const [loading, setLoading] = useState(true)
	const [editQuiz, setEditQuiz] = useState([])
	const [isValid, setIsValid] = useState(false)
	let navigate = useNavigate();
	useEffect(() => {
		if (!user.uid) {
			setLoading(false)
			return
		}
		
		let validator = user.email
		if(validator === 'verma071276@gmail.com'){
			setIsValid(true)
		}

		const fetchQuizData = async () => {
			const results = await axios.get(`${process.env.REACT_APP_HOST}/API/users/${user.uid}`)
			if(results.data.createdQuiz) setCreatedQuizzes(results.data.createdQuiz)
			if(results.data.attemptedQuiz) setAttemptedQuizzes(results.data.attemptedQuiz)

			setLoading(false)
		}
		if(user){ 
			fetchQuizData()
		}
	}, [user])


	const editQuizHandle = async (title, questions, isOpen) => {
		if (!title) setEditQuiz([])
		else {
			setLoading(true)
			console.dir({
				quizId: createdQuizzes[editQuiz]._id,
				uid: user.uid,
				title,
				questions,
				isOpen,
			})
			const results = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/edit`, {
				method: 'POST',
				body: JSON.stringify({
					quizId: createdQuizzes[editQuiz]._id,
					uid: user.uid,
					title,
					questions,
					isOpen,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			const submitData = await results.json()
			console.dir("submitData",submitData)
			const temp = [...createdQuizzes]
			temp[editQuiz[0]].title = title
			temp[editQuiz[0]].questions = questions
			temp[editQuiz[0]].isOpen = isOpen
			setCreatedQuizzes(temp)
			setEditQuiz([])
			setLoading(false)
		}
	}


	if (loading) return <LoadingScreen />
	
	const validateRedirection = () =>{
		navigate(`${process.env.REACT_APP_HOST}`)
		navigate(0)
		// return <Navigate exact={process.env.REACT_APP_HOST} />
	}

		if (editQuiz.length)
			return (
				<CreateQuiz
					user={user}
					quizTitle={createdQuizzes[editQuiz].title}
					questions={createdQuizzes[editQuiz].questions}
					isOpen={createdQuizzes[editQuiz].isOpen}
					editQuizHandle={editQuizHandle}
				/>
			)
		if(!isValid){
			return validateRedirection()
		}
		else{
			return (
				<div className='dash-body'>
					<div className='quizzes'>
						<div className='heading'>
							<div className='line-left' />
							<h2>Created </h2>
							<div className='line' />
						</div>
						<div className='card-holder'>
							{createdQuizzes.map((quiz, key) => (
								<CreatedQuizCard
									key={key}
									index={key}
									setEditQuiz={setEditQuiz}
									title={quiz.title}
									code={quiz._id}
									responses={quiz.responses}
									questions={quiz.questions.length}
									isOpen={quiz.isOpen}
								/>
							))}
						</div>
					</div>
					<div className='quizzes'>
						<div className='heading'>
							<div className='line-left' />
							<h2>Attempted </h2>
							<div className='line' />
						</div>
						<div className='card-holder'>
							{attemptedQuizzes.map((quiz, key) => (
								<JoinedQuizCard
									key={key}
									title={quiz.title}
									score={quiz.responses[0].score}
									questions={quiz.totalQuestions}
								/>
							))}
						</div>
					</div>
				</div>
			)
		}
	
}

export default UserDashboard
