import React from 'react';

const Solution = () => {
  const solutions = [
    {
      title: "Centralized Portfolio",
      description: "One link to showcase all your projects, certifications, and academic milestones.",
      highlight: "Unified"
    },
    {
      title: "AI-Generated Resume",
      description: "Instantly create tailored resumes for different job descriptions using your data.",
      highlight: "Instant"
    },
    {
      title: "Career Guidance",
      description: "Data-driven insights on what skills you need to learn for your dream role.",
      highlight: "Smart"
    },
    {
      title: "Interview Preparation",
      description: "Practice with AI that knows your background and the job you're applying for.",
      highlight: "Personal"
    }
  ];

  return (
    <section className="section-padding solution-section">
      <div className="section-container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 className="heading-secondary" style={{ marginBottom: '1rem' }}>
            Everything you need to <br/> <span className="text-accent">launch your career</span>
          </h2>
          <p className="text-muted" style={{ fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto' }}>
             We've built the tools to help you translate your hard work into hired work.
          </p>
        </div>

        <div className="solution-grid">
          {solutions.map((item, index) => (
            <div key={index} className="solution-card">
               <div style={{ marginBottom: '1rem' }}>
                  <span className="highlight-tag">
                     {item.highlight}
                  </span>
               </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>{item.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solution;