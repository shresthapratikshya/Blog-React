import React from 'react'
import { Link } from 'react-router-dom'
import '../css/signup.css';

const SignUp = () => {
    return (
        <div className='signup-page'>
            <h1 className="signup-header">SIGN UP</h1>
            <input type="text" placeholder='Email'></input>
            <input type="password" placeholder='Password'></input>
            <input type="password" placeholder='Confirm Password'></input>
            <p>Already have an account?<Link to={'/login'} className="login-link"> Login</Link></p>
            <button type='submit' className="signup-button">SIGN UP</button>
            <button>SIGN UP WITH GOOGLE</button>

        </div>
    )
}

export default SignUp
