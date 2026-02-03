import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopNav.css';
import { auth } from '../../../firebase';

const TopNav = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if(!confirm("Are you sure you want to logout?")) return;   
      auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Logout failed, please try again");
    }
  };

  return (
    <div className="topnav-container bg-white shadow-md">
      {/* Full-width top nav bar */}
      <div className="topnav-bar relative flex items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Center: Welcome */}
        <div className="flex-1 flex justify-center">
          <span className="welcome-text text-gray-700 text-base font-medium">
            Hi, Welcome Back {/* {loggedInUser?.name} */}
          </span>
        </div>

        {/* Right: Logout */}
        <div className="absolute right-4 flex items-center">
          <button
            onClick={handleLogout}
            className="logout-btn flex items-center px-2 py-2 text-white bg-red-600 cursor-pointer rounded hover:bg-red-700 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default TopNav;
