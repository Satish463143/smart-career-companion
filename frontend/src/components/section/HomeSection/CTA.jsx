import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="cta-section">
      {/* Decorative Circles */}
      <div className="cta-blob cta-blob-1"></div>
      <div className="cta-blob cta-blob-2"></div>

      <div className="cta-content-wrapper">
        <h2 className="heading-primary" style={{ marginBottom: '1.5rem' }}>
          Ready to take control of your <br/>
          <span className="text-accent">academic journey?</span>
        </h2>
        
        <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '42rem', margin: '0 auto 2.5rem' }}>
          Join thousands of students who are building their future with Smart Career Companion.
        </p>

        <div className="cta-buttons">
          <Link 
            to="/signup" 
            className="btn-cta-primary"
            style={{ textDecoration: 'none' }}
          >
            Get Started for Free
          </Link>
          <Link 
            to="/login"
            className="btn-cta-outline"
            style={{ textDecoration: 'none' }}
          >
            Log In
          </Link>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          No credit card required. Free for students.
        </p>
      </div>
    </section>
  );
};

export default CTA;