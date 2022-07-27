import React, { useState, useEffect } from 'react'
// import { Navigate } from 'react-router-dom'
import {useNavigate} from "react-router-dom"
import './CreateQuiz.css'
import AddQuestionModal from '../components/AddQuestionModal'
import QuestionsTable from '../components/QuestionsTable'
import { Switch } from '@material-ui/core'
import LoadingScreen from './LoadingScreen'
require('dotenv').config()

const CreateQuiz = ({
	user,
	quizTitle,
	questions,

	isOpen,
	editQuizHandle
}) => {
	const [questionArray, setQuestionArray] = useState([])
	const [title, setTitle] = useState('')
	const [access, setAccesss] = useState(true)
	const [loading, setLoading] = useState('stop')
	const [quizCode, setQuizCode] = useState(null)
	let navigate = useNavigate();
	const addQuestionHandle = (title, optionType, options) => {
		const arr = [...questionArray]
		arr.push({ title, optionType, options })
		setQuestionArray(arr)
	}
	useEffect(() => {
		if (quizTitle) {
			setTitle(quizTitle)
			setQuestionArray(questions)
			setAccesss(isOpen)
		}
	}, [quizTitle, questions, isOpen])

	const createQuiz = async () => {
		if (!(title.length || questionArray.length)) {
			alert('Please add title and questions.')
			return
		} else if (!title.length) {
			alert('Please add Quiz title.')
			return
		} else if (!questionArray.length) {
			alert('Please add any questions.')
			return
		}
		setLoading('start')
		try {
			const result = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/create`, {
				method: 'POST',
				body: JSON.stringify({
					title,
					uid: user.uid,
					questions: questionArray,
					isOpen: access
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const body = await result.json()
			setQuizCode(body.quizId)
		} catch (e) {
			setLoading('error')
		}
	}
	if (quizCode) {
		navigate(`/created-succesfully/${quizCode}`)
		navigate(0)
	}
	// <Navigate push to={`/created-succesfully/${quizCode}`} />

	if (loading === 'start') return <LoadingScreen />

	return (
		<div id='main-body'>
			<div id='create-quiz-body'>
				<div className='quiz-header'>
					<input
						type='text'
						className='input-text'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						id='quiz-title'
						placeholder='Untitled Quiz'
						autoFocus
						autoComplete='off'
					/>
				</div>
				<div className='controls'>
					<AddQuestionModal addQuestionHandle={addQuestionHandle} />
					<div className='switch'>
						<Switch
							checked={access}
							onChange={(e) => setAccesss(e.target.checked)}
							color='secondary'
							name='access'
						/>
						<h4>{access ? 'Public' : 'Private'}</h4>
					</div>
				</div>
			</div>
			<div className='questionTable'>
				<QuestionsTable
					questionArray={questionArray}
					setQuestionArray={setQuestionArray}
				/>
			</div>
			<div>
				{quizTitle && (
					<button className='add-btn' onClick={() => editQuizHandle()}>
						Close
					</button>
				)}
				<button
					// disabled={!(title.length && questionArray.length)}
					className='button wd-200'
					onClick={() => {
						if (quizTitle) editQuizHandle(title, questionArray, access)
						else createQuiz()
					}}
				>
					{quizTitle ? 'Save ' : 'Create '}
					Quiz
				</button>
			</div>
		</div>
	)
}

export default CreateQuiz
