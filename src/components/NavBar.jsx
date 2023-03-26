import React from 'react'
import { Link } from 'react-router-dom';
import '../css/navbar.css';

const NavBar = () => {
    return (
        <nav>
            <img src='blog-logo.png' alt='blog-logo' className='nav-image'></img>
            <div className='nav-element'>
                <Link to={`/`} className="nav-content">HOME</Link>
                <Link to={`/about`} className="nav-content">ABOUT</Link>
                <Link to={`/account`} className="nav-content">ACCOUNT</Link>
            </div>
        </nav>
    )
}

export default NavBar
