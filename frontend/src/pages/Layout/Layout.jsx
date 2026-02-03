import React from 'react'
import Navbar from '../../components/common/Navbar/Navbar'
import Footer from '../../components/common/Footer/Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
        <Navbar />
        <Outlet />
        <Footer />
    </div>
  )
}

export default Layout