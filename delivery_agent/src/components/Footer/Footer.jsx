import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import craveIt_logo from '../../assets/craveIt_logo.png'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={craveIt_logo} alt="" />
                    <p>CraveIt brings your favorite meals to your doorstep in minutes. Discover local restaurants, explore diverse cuisines, and satisfy every craving with seamless ordering, real-time tracking, and fast delivery. Fresh flavors, trusted partners, and effortless convenience—CraveIt makes food happiness just a tap away.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+1-232-332-4564</li>
                        <li>contact@craveit.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright 2026 © craveit.com - All Rights Reserved.</p>

        </div>
    )
}

export default Footer
