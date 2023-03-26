import React from 'react'
import { Link } from 'react-router-dom'
import '../css/login.css';

const login = () => {
    return (
        <div className='login-page'>
            <h1 className="login-header">Login</h1>
            <input type="text" placeholder='Email'></input>
            <input type="password" placeholder='Password'></input>
            <p>New Blogger?<Link to={'/signup'} className="signup-link"> SignUp</Link></p>
            <button type='submit' className="signup-button">LOGIN</button>

        </div>
    )
}

export default login
