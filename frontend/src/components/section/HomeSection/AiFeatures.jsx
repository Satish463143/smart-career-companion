import React from 'react';

const AiFeatures = () => {
  const features = [
    {
      title: "Smart Resume Generator",
      description: "Our AI analyzes job descriptions and tailors your resume keywords to pass ATS filters automatically.",
      tag: "Popular"
    },
    {
      title: "Career Path Predictor",
      description: "Based on your current skills and interests, we map out potential future roles and salary trajectories.",
      tag: "New"
    },
    {
      title: "Virtual Interview Coach",
      description: "Participate in realistic mock interviews with real-time feedback on your tone, pace, and answers.",
      tag: "Interactive"
    }
  ];

  return (
    <section className="section-padding ai-section">
      <div className="section-container">
         <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 className="heading-secondary" style={{ marginBottom: '1rem' }}>
               Powered by Advanced AI, <br />
               <span className="text-accent">Designed for You</span>
            </h2>
            <p className="text-muted">Cutting-edge technology working behind the scenes to boost your career.</p>
         </div>

        <div className="ai-grid">
          {features.map((feature, index) => (
            <div key={index} className="ai-card group">
              <div className="ai-bg-icon">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
                </svg>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                 <span className="tag">
                    {feature.tag}
                 </span>
              </div>
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>{feature.title}</h3>
              <p className="text-muted" style={{ marginBottom: '2rem' }}>
                {feature.description}
              </p>
              
              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-soft)' }}>
                 <button className="btn-link">
                    Try this feature <span>→</span>
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AiFeatures;