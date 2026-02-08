import Navbar from '../../components/CMS/Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import './CMSLayout.css'
import TopNav from '../../components/CMS/TopNav/TopNav'

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