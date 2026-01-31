import React from 'react';
import './Home.css'

const Problem = () => {
  const problems = [
    {
      id: 1,
      icon: "📂",
      title: "Scattered Academic Records",
      description: "Projects on GitHub, certificates in Drive, grades in a portal—it's a mess to track everything."
    },
    {
      id: 2,
      icon: "📝",
      title: "Resume Writer's Block",
      description: "Staring at a blank page, not knowing how to translate school projects into professional bullet points."
    },
    {
      id: 3,
      icon: "🧭",
      title: "Unclear Career Direction",
      description: "Having skills but not knowing which roles fit them best or what to learn next."
    }
  ];

  return (
    <section className="section-padding problem-section">
      <div className="section-container text-center" style={{ maxWidth: '56rem' }}>
        <div className="badge">
           <span className="badge-text" style={{ color: 'var(--color-text-muted)' }}>The Challenge</span>
        </div>
        <h2 className="heading-secondary" style={{ marginBottom: '4rem' }}>
          Why is building a career profile <br style={{ display: 'none' }} className="md-block" />so overwhelming?
        </h2>

        <div className="problem-grid">
          {problems.map((problem) => (
            <div key={problem.id} className="problem-card">
              <div className="problem-icon-wrapper">
                {problem.icon}
              </div>
              <h3 className="problem-title">{problem.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;