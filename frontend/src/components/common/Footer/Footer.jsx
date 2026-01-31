import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Top Section */}
                <div className="footer-top">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <h3>Smart Career Companion</h3>
                        <p>
                            AI-powered academic portfolio and career guidance platform designed to help students succeed.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-icon" aria-label="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect x="2" y="9" width="4" height="12"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                            <a href="#" className="social-icon" aria-label="GitHub">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                </svg>
                            </a>
                            <a href="#" className="social-icon" aria-label="Email">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div>
                        <h4 className="footer-heading">Platform</h4>
                        <ul className="footer-links">
                            <li><a href="#banner" className="footer-link">Home</a></li>
                            <li><a href="#about" className="footer-link">About</a></li>
                            <li><a href="#workflow" className="footer-link">Workflow</a></li>
                            <li><a href="#aifeatures" className="footer-link">AI Features</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-heading">Account</h4>
                        <ul className="footer-links">
                            <li><Link to="/login" className="footer-link">Login</Link></li>
                            <li><Link to="/signup" className="footer-link">Sign Up</Link></li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="footer-heading">Legal</h4>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Privacy Policy</a></li>
                            <li><a href="#" className="footer-link">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="footer-bottom">
                    <p className="copyright">
                        © 2025 Smart Career Companion. All rights reserved.
                    </p>
                    <p>
                        Developed by <a href="https://bleedingtech.com.np/" target="_blank"><span className='font-bold'>Bleeding Tech Pvt. Ltd.</span></a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;