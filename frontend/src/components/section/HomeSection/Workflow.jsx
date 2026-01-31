import React from 'react';

const Workflow = () => {
  const steps = [
    {
      id: "01",
      title: "Create Profile",
      description: "Sign up and import your academic history securely."
    },
    {
      id: "02",
      title: "Add Achievements",
      description: "Log projects, grades, and extracurriculars easily."
    },
    {
      id: "03",
      title: "AI Analysis",
      description: "Our engine identifies your strengths and skill gaps."
    },
    {
      id: "04",
      title: "Get Hired",
      description: "Generate resumes and prep for interviews instantly."
    }
  ];

  return (
    <section className="section-padding workflow-section">
      <div className="section-container">
         <div className="workflow-header">
            <div style={{ maxWidth: '36rem' }}>
               <h2 className="heading-secondary" style={{ marginBottom: '1rem' }}>
                  Your path to success,<br /> simplified.
               </h2>
            </div>
            <div className="hidden md-block">
               <button style={{ color: 'var(--color-accent-primary)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
                  See full documentation &rarr;
               </button>
            </div>
         </div>

        <div className="workflow-steps-container">
          {/* Connecting Line (Desktop) */}
          <div className="timeline-line"></div>

          <div className="steps-grid">
            {steps.map((step) => (
              <div key={step.id} className="workflow-step">
                 {/* Dot */}
                 <div className="step-dot"></div>
                 
                 <div className="step-content">
                    <span className="step-id">{step.id}</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{step.title}</h3>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                      {step.description}
                    </p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;