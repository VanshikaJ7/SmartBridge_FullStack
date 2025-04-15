import React, { useState } from 'react';
import '../Styling/landing.css';

import socialeXLogo from '../images/SocialeX.png';
import About1 from '../images/connection.png';
import About2 from '../images/amplify.png';

import Login from '../components/login';
import Register from '../components/Register';

const LandingPage = () => {

    const [isLoginBox, setIsLoginBox] = useState(true);


  return (
    <div className='landingPage'>
        
        <div className="landing-header">
            <span className="landing-header-logo"><img src={socialeXLogo} alt="" /></span>
            <ul>
                <li className='header-li'><a href="#home">Home</a></li>
                <li className='header-li'><a href="#about">About Us</a> </li>
                <li className='header-li'><a href="#home">Join Us</a></li>
            </ul>
        </div>


        <div className="landing-body">

            <div className="landing-hero" id='home'>
                <div className="landing-hero-content">
                    <h1 >sphere</h1>
                    <br></br>
                    <p>Step into SPHERE, the playground for the wildly imaginative, where vibrant communities thrive and eccentricities are celebrated. </p>

                    <div className="authentication-form">

                        { isLoginBox ?

                            <Login setIsLoginBox={setIsLoginBox} />
                            :
                            <Register setIsLoginBox={setIsLoginBox} />
                        }

                    </div>

                </div>


                <div className="landing-hero-image">
                    
                        <div id='landing-image-sidebar-left'></div>
                        <div className="back"></div>
                        <div id='landing-image-sidebar-right'></div>
                   
                </div>
            </div>

            <div className="landing-about" id='about'>

                <div className="about-1">
                    <img src={About1} className='about-1-img' alt="" />
                    <div className="about-1-content">

                        <h2>Keep Friendships Alive, Wherever You Are</h2>
                        <p>SPHERE helps you stay in touch with old friends across any distance. Connect on the platform, follow their journeys, and see what they are up to. Like, comment, share memories, and relive the good times—because true connections never fade.</p>
                        <a href='#home'>Join now!!</a>

                    </div>
                </div>
                <div className="about-2">
                    <div className="about-2-content">
                        <h2>Your Voice, Your Stage</h2>
                        <p>SPHERE opens the door for you to express your thoughts, creativity, and passion to the world. Whether you're creating art, writing stories, making music, or sharing ideas, the platform gives you the space to shine and connect with an audience that values your unique voice.</p>
                        <a href='#home'>Join now!!</a>
                    </div>
                    <img src={About2} className='about-2-img' alt="" />
                </div>

            </div>

            <div className="footer">
                <p>All rights reserved - &#169; SPHERE.com</p>
            </div>


        </div>

    </div>
  )
}

export default LandingPage