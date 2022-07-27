import { Routes, Route } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import store from './store';
import axios from "axios"


// Stylesheet
import './App.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
// Components
import Home from './screens/Home'
import OneTimeDashBoard from './screens/OneTimeDashboard'
import CreateQuiz from './screens/CreateQuiz'
import JoinQuiz from './screens/JoinQuiz'
import UserDashboard from './screens/UserDashboard'
import CreatedSuccesfully from './screens/CreatedSuccesfully'
import NotFoundPage from './screens/NotFoundPage'
import AttemptQuiz from './screens/AttemptQuiz'
import Appbar from './components/Appbar'
import Responses from './screens/Responses'
import ShowResponses from './screens/ShowResponse'
import AttemptBlindQuiz from './screens/AttemptBlindQuiz'
import AttemptedModal from './screens/AttemptedModal'
import SignUp from "./components/Auth/Signup"
// import Auth from './components/Auth/Auth'
require('dotenv').config()

const App = () => {
	const [user, setUser] = useState({})
	useEffect(() => {
		if(localStorage.getItem('_ID')){
			let id = localStorage.getItem('_ID')
			axios.get(`${process.env.REACT_APP_HOST}/API/users/find/${id}`,{
				headers: {
					authorization: localStorage.getItem('JWT_PAYLOAD')
				  }
			}).then(res => {
				setUser(res.data.user)
				store.dispatch({
					user: res.data.user,
					type: 'set_user'
				})
			}).catch((er) => {
			  console.log(er)
			})
		  }
	}, [])
	return (
		<div className='App'>
			{!(user.uid) ? (
				<>
					<Routes>
						<Route path='/' element={<Home setUser={setUser} />} />
						<Route path='/signup' element={<SignUp />} />
					</Routes>
				</>

			) : (
				<>
					<div>
						<Appbar user={user} setUser={setUser} />
					</div>
					<Routes>
						<Route exact path='/' element={<OneTimeDashBoard user={user} />} />
						<Route path='/dashboard' element={<UserDashboard user={user} />} />

						<Route path='/create-quiz' element={<CreateQuiz user={user} />} />
						<Route path='/created-succesfully/:quizCode'element={<CreatedSuccesfully />}
						/>
						<Route path='/join-quiz' element={<JoinQuiz user={user} />} />
						<Route path='/result/:qid' element={<AttemptedModal user={user}/>} />
						<Route path='/attempt-quiz/:quizCode' element={<AttemptQuiz />} />
						<Route
							path='/attempt-blind-quiz/:quizCode'
							element={<AttemptBlindQuiz />}
						/>
						<Route path='/responses/:quizCode' element={<Responses />} />
						<Route path='/res/:quizid/:uid' element={<ShowResponses />} />
						<Route element={<NotFoundPage />} />
					</Routes>
				</>
			 )
			} 
		</div>
	)
}


export default App
