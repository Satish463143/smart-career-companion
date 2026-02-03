import Navbar from '../../Components/CMS/Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import './CMSLayout.css'
import TopNav from '../../Components/CMS/TopNav/TopNav'

const CMSLayout = () => {

  return (
    <div className='body_grid'>
        <div><Navbar/></div>         
        <div className='body_box'> 
          <TopNav />
          <Outlet/>
        </div>
    </div>
  )
}

export default CMSLayout