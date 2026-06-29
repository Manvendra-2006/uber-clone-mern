import React from 'react'
import UberImage from "../assets/Uber.avif";
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div>
        <div style={{height:"100vh",width:"100%",border:"2px solid black"}}>
            <div>
                <img src={UberImage} alt="" height="500px" width="100%" />
            </div>
            <div>Get Started With Uber</div>
            <div>
                <Link to="/userlogin">Continue</Link>
            </div>
        </div>
    </div>
  )
}

export default Home