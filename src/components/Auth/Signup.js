import React, { useState } from "react";

export default function SignUp(props){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    return(
        <div className="sign-up-wrapper">
            <div className="form">
                <div className="input-wrapper">
                    <div className="input-label">First Name</div>
                    <input className="input" type="text" placeholder="First Name" value={fname} onChange={e => setFname(e.target.value)} />
                </div>
                <div className="input-wrapper">
                    <div className="input-label">Last Name</div>
                    <input className="input" type="text" placeholder="Last Name" value={lname} onChange={e => setLname(e.target.value)} />
                </div>
                <div className="input-wrapper">
                    <div className="input-label">Email Address</div>
                    <input className="input" type="text" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="input-wrapper">
                    <div className="input-label">Password</div>
                    <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="btn" onClick={() => props.signUp(fname,lname,email, password)}>Sign Up</div>  
            </div>
        </div>        
    )

}

    
