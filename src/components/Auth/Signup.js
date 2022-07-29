import React, { useState , useEffect } from "react";
import {useForm} from "react-hook-form" 
import {useNavigate} from "react-router-dom"
import LoadingScreen from '../../screens/LoadingScreen'
import axios from "axios"

const SignUp = () =>{
    const [loading, setLoading] = useState(true)
    let navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fname, setFname] = useState('')
    const [cname, setCname] = useState('')
    const [message, setMessage] = useState('')
    const {register, formState:{errors}, handleSubmit} = useForm({mode:"all"})

    const handleChange = (e) =>{
        setCname(e)
    }
    useEffect(()=>{
        let isMounted = true
        if(isMounted){
            setLoading(false)
        }
    }, [])

    let signUp = (name, collegename, email , password) =>{
        axios.post(`${process.env.REACT_APP_HOST}/API/users/register`, {name,collegename,email, password}).then(res=> {
            if(res.data.success){
                navigate('/')
		        navigate(0)
            }
            else
            {
                setMessage(res.data.message)
            }
        }).catch(err =>{
            console.log("err from catch",err)
        })
    }

    const handleSub = (e) =>{
        if(errors.name || errors.email || errors.cname || errors.password){
            return null
        }else{
            signUp(fname,cname,email, password)
        }
    }

    let changeTab = () =>{
		navigate('/')
		navigate(0)
    }

    if(message){
        alert(message)
        setMessage('')
    }

    return(

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
						<div className="sign-up-wrapper">
                        <form onSubmit={handleSubmit((data) => console.log(data))}>
                            <div className="form">
                                <div className="input-wrapper">
                                    <div className="input-label">Name</div>
                                    <input {...register("name" , {required:"Name is Required"})} className="input" type="text" placeholder="Name" value={fname} onChange={e => setFname(e.target.value)} />
                                    <p className="err">{errors.name?.message}</p>
                                </div>
                                <div className="input-wrapper">
                                    <div className="input-label">College Name:</div>
                                    <select {...register("cname" , {required:"College Name is required"})} className="input" onChange={(e) =>handleChange(e.target.value)}>
                                        <option value="">Select College Name</option>
                                        <option value="Indore Institute of Science and Technology">Indore Institute of Science and Technology</option>
                                        <option value="Medicaps">Medicaps</option>
                                        <option value="Chameli Devi College">Chameli Devi College</option>
                                        <option value="Sushila Devi Bansal">Sushila Devi Bansal</option>
                                    </select>
                                    <p className="err">{errors.cname?.message}</p>
                                </div>
                                <div className="input-wrapper">
                                    <div className="input-label">Email Address</div>
                                    <input {...register("email" , {required:"Email Id is required" , pattern:{value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: "Email must be valid"}})} className="input" type="text" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                                    <p className="err">{errors.email?.message}</p>

                                </div>
                                <div className="input-wrapper">
                                    <div className="input-label">Password</div>
                                    <input {...register("password" , {required:"Password is required"})} className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                                    <p className="err">{errors.password?.message}</p>

                                </div>
                                <button className="btn" type="Submit" onClick={handleSub}>Sign Up</button>
                            </div>
                        </form>
                    </div>  
						<div className='new' onClick={changeTab}>New to Quizz itt? Sign-up here</div>

						{/* <div className='new' onClick={changeTab}>{state === 'signin' ? 'New to Quizz itt? Sign-up here' : 'Already have an account? Please Sign In'}</div> */}
					</div>
				</div>
			)}
		</>
       
    )

}

export default SignUp

