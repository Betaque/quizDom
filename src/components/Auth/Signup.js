import React, { useState } from "react";

export default function SignUp(props){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fname, setFname] = useState('')
    const [cname, setCname] = useState('')
    return(
        <div className="sign-up-wrapper">
            <div className="form">
                <div className="input-wrapper">
                    <div className="input-label">Name</div>
                    <input className="input" type="text" placeholder="Name" value={fname} onChange={e => setFname(e.target.value)} />
                </div>
                <div className="input-wrapper">
                    <div className="input-label">College Name:</div>
                    <input className="input" type="text" placeholder="College Name" value={cname} onChange={e => setCname(e.target.value)} />
                </div>
                <div className="input-wrapper">
                    <div className="input-label">Email Address</div>
                    <input className="input" type="text" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="input-wrapper">
                    <div className="input-label">Password</div>
                    <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="btn" onClick={() => props.signUp(fname,cname,email, password)}>Sign Up</div>  
            </div>
        </div>        
    )

}

    
