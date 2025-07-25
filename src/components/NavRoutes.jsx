import React from 'react'
import { Link } from 'react-router-dom'
import TopNavbar from './TopNavbar'

const NavRoutes = () => {
  return (
    <nav>
      <TopNavbar />
      {/* <Link to="/manage/users">Home</Link> */}
      {/* <Link to="/about">About</Link>
      <Link to="/dashboard">Dashboard</Link> */}
    </nav>
  )
}

export default NavRoutes