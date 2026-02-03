import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { GiNotebook } from 'react-icons/gi';
import { BsFileEarmarkText } from 'react-icons/bs';

import './Navbar.css'; // Import the custom styles

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin') {
      setActiveMenu('dashboard');
    } else if (path.includes('/admin/users')) {
      setActiveMenu('users');
    } 
  }, [location]);

  const linkClasses = (menu) =>
    `navbar-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition duration-200 ease-in-out ${
      activeMenu === menu
        ? 'active-link'
        : 'inactive-link'
    }`;

  return (
    <div className="hidden md:block w-64 bg-white shadow-md h-screen py-6 px-3 custom-navbar-container">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 px-3">Admin Panel</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/admin" className={linkClasses('dashboard')} onClick={() => setActiveMenu('dashboard')}>
              <FaHome className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={linkClasses('users')} onClick={() => setActiveMenu('users')}>
              <BsFileEarmarkText className="w-5 h-5" />
              <span>users</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
