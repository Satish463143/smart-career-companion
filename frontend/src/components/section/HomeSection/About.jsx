import React from 'react';

const About = () => {
  return (
    <section className="section-padding about-section">
      <div className="section-container">
        <div className="about-grid">
          {/* Left: Vision */}
          <div className="space-y-6">
            <h2 className="heading-secondary">
              Bridging the Gap Between <br />
              <span className="text-accent">Academic Potential</span> & Career Success
            </h2>
            <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>
              We believe every student has a unique story that grades alone can't capture. The Smart Career Companion is your intelligent partner in documenting achievements, analyzing your skills, and presenting your best self to the world.
            </p>
            <p className="text-muted" style={{ fontSize: '1.125rem' }}>
              Our mission is to replace scattered files and forgotten projects with a cohesive, living portfolio that evolves with you—powered by AI to guide your next steps.
            </p>
          </div>

          {/* Right: Icon Cards */}
          <div className="icon-grid">
            <div className="feature-card">
              <div className="card-icon">
                🎓
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Student Centric</h3>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Designed specifically for the academic journey, not just experienced professionals.</p>
            </div>

            <div className="feature-card mt-stagger">
              <div className="card-icon">
                🤖
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>AI Powered</h3>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Leveraging advanced AI to turn your raw data into polished career assets.</p>
            </div>

            <div className="feature-card">
              <div className="card-icon">
                🔒
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Private & Secure</h3>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Your data belongs to you. Share only what you choose with recruiters.</p>
            </div>

            <div className="feature-card mt-stagger">
              <div className="card-icon">
                📈
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Growth Focused</h3>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Real-time feedback on your profile strength and skill gaps.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;