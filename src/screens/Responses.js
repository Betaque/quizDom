import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router-dom'

import LoadingScreen from './LoadingScreen'
import firebase from '../firebase/firebase'
import ResponsesTable from '../components/ResponsesTable'
require('dotenv').config()


const Responses = () => {
	const {quizCode} = useParams()
	const uid = firebase.auth().currentUser.uid
	const [loading, setLoading] = useState(true)
	const [responses, setResponses] = useState([])

	useEffect(() => {
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
	}, [quizCode, uid])
	console.log("responses222",responses)
	if (loading) return <LoadingScreen />
	else
		return (
			<div className='margin-top'>
				<h2>Responses</h2>
				<ResponsesTable responses={responses} />
			</div>
		)
}

export default Responses
