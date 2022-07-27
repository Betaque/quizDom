import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router-dom'

import LoadingScreen from './LoadingScreen'
import ResponsesTable from '../components/ResponsesTable'
import axios from "axios"
require('dotenv').config()


const Responses = () => {
	const {quizCode} = useParams()
	const [uid,setUid] = useState()
	const [loading, setLoading] = useState(true)
	const [responses, setResponses] = useState([])
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

			  const getResponses = async () => {
				const res = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/responses`, {
					method: 'POST',
					body: JSON.stringify({ quizCode: quizCode, uid }),
					headers: {
						'Content-Type': 'application/json',
					},
				})
				const result = await res.json()
				setResponses(result.finalResponse)
				setLoading(false)
			}

			if(uid !== undefined){
				getResponses()
			}
			
			
		}
		catch{
			console.log("Error while fetching the responses")
		}
		
		
	}, [quizCode, uid])

	if (loading) return <LoadingScreen />
	else
		return (
			<div className='margin-top'>
				<h2>Responses</h2>
				<ResponsesTable responses={[responses,uid]} />
			</div>
		)
}

export default Responses
