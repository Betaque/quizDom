import React, { useState, useEffect } from 'react'
import Signin from "../components/Auth/Signin"
import Signup from "../components/Auth/Signup"
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
	let navigate = useNavigate();

    const [state, setState] = useState('signin')

	useEffect(() => {
		let isMounted = true
		const id = localStorage.getItem('_ID')
		console.log("id",id)
		const fetchUser = async () =>{
			console.log("inside functions")
			// setIsLoggedIn(!!user)
			try{
				const res = await axios.post(`${process.env.REACT_APP_HOST}/API/users/find`, {id})
				if(res.data.success){
					setUser({
						uid: res.data.user.uid,
						name: res.data.user.name,
						email: res.data.user.email
					})
					console.log('User Logged In')
				}else {
					console.log('User Signed Out')
					setUser({})
				}
				console.log('auth change')
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
				console.log("ress from teh res.data.success",res)
                store.dispatch({
                    type: 'login',
                    _id: res.data.user._id,
                    user: res.data.user,
                    token: res.data.token
                });
                console.log(store.getState())
				navigate('/')
				navigate(0)
				// return <navigate to={'./'} />
            }
        }).catch(err =>{
            console.log(err)
        })
    }

    let signUp = (name, collegename, email , password) =>{
        axios.post(`${process.env.REACT_APP_HOST}/API/users/register`, {name,collegename,email, password}).then(res=> {
            console.log("Res from signUp",res)
            if(res.data.success){
                setState('signin')
            }
        }).catch(err =>{
            console.log("err from catch",err)
        })
    }

    let changeTab = () =>{
        page = state === 'signin' ? setState('signup')  : setState('signin') 
    }


    let page = state === 'signin' ? <Signin signIn={signIn}/> : <Signup signUp={signUp}/>

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
						{/* <div className='sub-header'>Welcome to Quizz Itt</div> */}
						{page}
						<div className='new' onClick={changeTab}>{state === 'signin' ? 'New to Quizz itt? Sign-up here' : 'Already have an account? Please Sign In'}</div>
					</div>

					{/* <div id='login-card'>
						<label className='login-label'>
							<b>Q</b>
						</label>
						{page}
                		<div className='new' onClick={changeTab}>{state === 'signin' ? 'New to Quizz itt? Sign-up here' : 'Already have an account? Please Sign In'}</div>
					</div> */}
				</div>
			)}
		</>
	)
}

export default Home
