import React from 'react'

const Banner = () => {
  return (
    <section className="banner-section">
      {/* Background Elements */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="section-container banner-content">
        {/* Text Content */}
        <div className="text-left">
          <div className="badge">
            <span className="badge-text">
              The Future of Academic Portfolios
            </span>
          </div>
          
          <h1 className="heading-primary" style={{ marginBottom: '1.5rem' }}>
            Smart Career <br />
            <span className="text-accent">Companion</span>
          </h1>
          
          <p className="text-muted" style={{ fontSize: '1.125rem', maxWidth: '32rem', margin: '0 auto' }}>
            Showcase your academic journey, generate AI-powered resumes, and unlock career opportunities with a platform designed for students.
          </p>
          
          <div className="banner-buttons">
            <button className="btn btn-primary">
              Get Started
            </button>
            <button className="btn btn-secondary">
              Learn More
            </button>
          </div>
          
          <div className="banner-stats">
            <div className="stat-item">
              <div className="stat-dot dot-success"></div>
              <span style={{ fontSize: '0.875rem' }}>AI Resume Builder</span>
            </div>
            <div className="stat-item">
              <div className="stat-dot dot-info"></div>
              <span style={{ fontSize: '0.875rem' }}>Academic Portfolio</span>
            </div>
          </div>
        </div>

        {/* Visual/Illustration Side */}
        <div className="banner-illustration">
           <div className="glass-card">
              {/* Mock Dashboard UI */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                 <div>
                    <div style={{ height: '1rem', width: '8rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '0.25rem', marginBottom: '0.5rem' }}></div>
                    <div style={{ height: '0.75rem', width: '5rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '0.25rem', opacity: 0.6 }}></div>
                 </div>
                 <div style={{ height: '2.5rem', width: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--color-accent-soft)' }}></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div style={{ height: '6rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-bg-primary)', padding: '1rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ height: '3rem', width: '3rem', borderRadius: '0.5rem', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-soft)' }}></div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <div style={{ height: '0.75rem', width: '75%', backgroundColor: 'var(--color-surface-muted)', borderRadius: '0.25rem' }}></div>
                       <div style={{ height: '0.75rem', width: '50%', backgroundColor: 'var(--color-surface-muted)', borderRadius: '0.25rem' }}></div>
                    </div>
                 </div>
                 <div style={{ height: '6rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-bg-primary)', padding: '1rem', display: 'flex', gap: '1rem', opacity: 0.7 }}>
                    <div style={{ height: '3rem', width: '3rem', borderRadius: '0.5rem', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-soft)' }}></div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <div style={{ height: '0.75rem', width: '75%', backgroundColor: 'var(--color-surface-muted)', borderRadius: '0.25rem' }}></div>
                       <div style={{ height: '0.75rem', width: '50%', backgroundColor: 'var(--color-surface-muted)', borderRadius: '0.25rem' }}></div>
                    </div>
                 </div>
              </div>
              {/* Floating Badge */}
              <div className="floating-badge">
                 <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                    ✓
                 </div>
                 <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Resume Score</p>
                    <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937' }}>98/100</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  )
}

export default Banner