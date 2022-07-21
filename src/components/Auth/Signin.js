import React, {useState} from "react";

export default function SignIn(props){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return(
        <div className="sign-in-wrapper">
            <div className="form">
                <div className="input-wrapper">
                    <div className="input-label">Email Address</div>
                    <input className="input" type="text" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="input-wrapper">
                    <div className="input-label">Password</div>
                    <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="btn" onClick={() => props.signIn(email, password)}>Sign In</div>  
            </div>
        </div>        
    )
}
