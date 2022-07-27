import React, {useState} from "react";
import {useForm} from "react-hook-form"

export default function SignIn(props){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {register, formState:{errors}, handleSubmit} = useForm({mode: "all"})
    const handleSub = (e) =>{
        if(errors.email || errors.password){
            return null
        }else{
            props.signIn(email, password)
        }
    }
    return(
        <div className="sign-in-wrapper">
            <form onSubmit={handleSubmit((data) => console.log(data))}>
                <div className="form">
                    <div className="input-wrapper">
                        <div className="input-label">Email Address</div>
                        <input {...register("email" , {required:"Email Id is required" , pattern:{value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: "Email must be valid"}})} className="input" type="text" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                        <p className="err">{errors.email?.message}</p>
                    </div>
                    <div className="input-wrapper">
                        <div className="input-label">Password</div>
                        <input {...register("password", {required:"Password is required"})} className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        <p className="err">{errors.password?.message}</p>
                    </div>
                    <button className="btn" type="Submit" onClick={handleSub}>Sign In</button>
                    <p className="m-err">{props.message}</p>
                </div>
            </form>
        </div>        
    )
}
