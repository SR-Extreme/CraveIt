import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import craveIt_admin_logo from '../../assets/CraveIt_admin_logo.png'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img className='logo' src={craveIt_admin_logo} alt="" />
      <img className='profile' src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar
