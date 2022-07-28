import React, { useState, useEffect } from 'react'
import Signin from "../components/Auth/Signin"
// import Signup from "../components/Auth/Signup"
// import './Auth.css'
import store from '../store/index'
import axios from "axios"    
import {useNavigate} from "react-router-dom"
import './Home.css'
// import { StyledFirebaseAuth } from 'react-firebaseui'
// import firebase from '../firebase/firebase'
import LoadingScreen from './LoadingScreen'

const Home = ({ setUser }) => {
	const [loading, setLoading] = useState(true)
	const [message,setMessage] = useState('')
	let navigate = useNavigate();

    // const [state, setState] = useState('signin')

	useEffect(() => {
		let isMounted = true
		const id = localStorage.getItem('_ID')
		const fetchUser = async () =>{
			// setIsLoggedIn(!!user)
			try{
				const res = await axios.post(`${process.env.REACT_APP_HOST}/API/users/find`, {id})
				if(res.data.success){
					setUser({
						uid: res.data.user.uid,
						name: res.data.user.name,
						email: res.data.user.email
					})
				}else {
					setUser({})
				}
				if (isMounted) setLoading(false)
			}catch{
				console.log("errror from home js")
			}
			
		}
		if(id){
			fetchUser()
		}
		if(id === null){
			setLoading(false)
		}

		return () => (isMounted = false)
	}, [setUser])
    

    let signIn = (email, password) =>{
        axios.post(`${process.env.REACT_APP_HOST}/API/users/login`, {email, password}).then(res=> {
            if(res.data.success){
                store.dispatch({
                    type: 'login',
                    _id: res.data.user._id,
                    user: res.data.user,
                    token: res.data.token
                });
				navigate('/' , {replace: true})
				navigate(0)
            }else{
				setMessage(res.data.message)
			}
        }).catch(err =>{
            console.log(err)
        })
    }

    let changeTab = () =>{
		navigate('/signup' , {replace: true})
		navigate(0)
    }



	return (
		<>
			{loading ? (
				<LoadingScreen />
			) : (
				<div id='Home' className='auth-wrapper'>
					<div id='logo'>
						<div id='logo-name'>
							<b>Quiz</b>dom
						</div>
						<div id='description'>
							Now create and join quiz at a single platform.You can create
							trivia quizzes, personality test, polls and survays. Share out
							your quiz with your students with a unique code.
						</div>
					</div>

					<div className='right'>
						<div className='header'><strong>Quiz</strong>dom</div>
						<Signin signIn={signIn} message={message} />
						<div className='new' onClick={changeTab}>New to Quizz itt? Sign-up here</div>

					</div>
				</div>
			)}
		</>
	)
}

export default Home
