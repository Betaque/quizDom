import React, {useState} from 'react';
import Signin from "./Signin"
import Signup from "./Signup"
import './Auth.css'
import store from '../../store/index'
import axios from "axios"    
import {useNavigate} from "react-router-dom"

export default function Auth(props){
    let navigate = useNavigate();

    const [state, setState] = useState('signin')
    

    let signIn = (email, password) =>{
        console.log("Signing in")
        axios.post(`${process.env.REACT_APP_HOST}/api/users/login`, {email, password}).then(res=> {
            console.log("ress from the api",res)
            if(res.data.success){
                console.log("shi hai")
                store.dispatch({
                    type: 'login',
                    _id: res.data.user._id,
                    user: res.data.user,
                    token: res.data.token
                });
                console.log("console",store.getState())
                navigate("./", { replace: true });
            }
        }).catch(err =>{
            console.log(err)
        })
    }

    let signUp = (firstName, lastName, email , password) =>{
        console.log("sign in")
        axios.post(`${process.env.REACT_APP_HOST}/api/users/register`, {firstName,lastName,email, password}).then(res=> {
            console.log("Res from signUp",res)
            if(res.data.success){
                console.log("Yeahhhhhhh")
                setState('signin')
            }
        }).catch(err =>{
            console.log("err from catch",err)
        })
    }
    console.log("state?",state)

    let changeTab = () =>{
        page = state === 'signin' ? setState('signup')  : setState('signin') 
    }


    let page = state === 'signin' ? <Signin signIn={signIn}/> : <Signup signUp={signUp}/>
    return(
        <div className='auth-wrapper'>
            <div className='left'>
                <img src="https://freesvg.org/img/chemist.png" alt='chemistImg'/>
            </div>
            <div className='right'>
                <div className='header'>Quizz Itt</div>
                <div className='sub-header'>Welcome to Quizz Itt</div>
                {page}
                <div className='new' onClick={changeTab}>{state === 'signin' ? 'New to Quizz itt? Sign-up here' : 'Already have an account? Please Sign In'}</div>
            </div>
        </div>
    )
}

    
    
