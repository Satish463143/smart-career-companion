import React, { useState, useEffect } from 'react';
import { auth, db } from "../../../firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import Modal from '../../common/Modal/Modal';
import EducationForm from '../../common/Forms/EducationForm';
import SkillsForm from '../../common/Forms/SkillsForm';
import ProjectsForm from '../../common/Forms/ProjectsForm';
import CertificatesForm from '../../common/Forms/CertificatesForm';
import './Profile.css';
import './Login.css';

export default function Profile() {
    // --- State ---
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [education, setEducation] = useState([]);
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [certificates, setCertificates] = useState([]);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(null); // 'Education', 'Skills', 'Projects', 'Certificates'

    // --- Auth Listener ---
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- Real-time Listeners ---
    useEffect(() => {
        if (!user) return; // Wait for user

        // Generic listener function
        const subscribe = (collectionName, setter) => {
            const q = query(collection(db, "users", user.uid, collectionName), orderBy("createdAt", "desc"));
            return onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setter(data);
            });
        };

        const unsubEducation = subscribe("education", setEducation);
        const unsubSkills = subscribe("skills", setSkills);
        const unsubProjects = subscribe("projects", setProjects);
        const unsubCertificates = subscribe("certificates", setCertificates);

        return () => {
            unsubEducation();
            unsubSkills();
            unsubProjects();
            unsubCertificates();
        };
    }, [user]);


    // --- Helpers ---
    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    const handleRemove = async (collectionName, id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        
        try {
            await deleteDoc(doc(db, "users", user.uid, collectionName, id));
        } catch (error) {
            console.error("Error deleting document:", error);
            alert("Failed to delete item.");
        }
    };

    const openModal = (section) => {
        setActiveSection(section);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setActiveSection(null);
    };

    // Helper for user display (fallback if not logged in for dev preview, though likely won't load data)
    const displayUser = user || {
        displayName: "Guest User",
        email: "guest@example.com"
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                
                {/* 1. Profile Header Section */}
                <section className="section-card profile-header-card">
                    <div className="profile-avatar">
                        {getInitials(displayUser.displayName)}
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{displayUser.displayName}</h1>
                        <p className="profile-email">{displayUser.email}</p>
                    </div>
                    <button className="btn-edit-profile" disabled title="Feature coming soon">
                        Edit Profile
                    </button>
                </section>

                {/* 2. Education Section */}
                <section className="section-card">
                    <div className="section-header">
                        <h2 className="section-title">Education</h2>
                        <button className="btn-add" onClick={() => openModal("Education")}>
                            + Add Education
                        </button>
                    </div>
                    <div className="item-list">
                        {education.map((edu) => (
                            <div key={edu.id} className="list-item">
                                <div className="item-content">
                                    <h3>{edu.degree}</h3>
                                    <p>{edu.institution}</p>
                                    <p className="item-meta">{edu.year}</p>
                                </div>
                                <button 
                                    className="btn-icon" 
                                    onClick={() => handleRemove("education", edu.id)}
                                    title="Remove"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        ))}
                        {education.length === 0 && <p className="text-muted">No education added yet.</p>}
                    </div>
                </section>

                {/* 3. Skills Section */}
                <section className="section-card">
                    <div className="section-header">
                        <h2 className="section-title">Skills</h2>
                        <button className="btn-add" onClick={() => openModal("Skills")}>
                            + Add Skill
                        </button>
                    </div>
                    <div className="skills-container">
                        {skills.map((skill) => (
                            <div key={skill.id} className="skill-chip">
                                <span>{skill.name}</span>
                                <span 
                                    className="skill-remove" 
                                    onClick={() => handleRemove("skills", skill.id)}
                                >×</span>
                            </div>
                        ))}
                         {skills.length === 0 && <p className="text-muted">No skills added yet.</p>}
                    </div>
                </section>

                {/* 4. Projects Section */}
                <section className="section-card">
                    <div className="section-header">
                        <h2 className="section-title">Projects / Experience</h2>
                        <button className="btn-add" onClick={() => openModal("Projects")}>
                            + Add Project
                        </button>
                    </div>
                    <div className="item-list">
                        {projects.map((proj) => (
                            <div key={proj.id} className="list-item">
                                <div className="item-content">
                                    <h3>{proj.title}</h3>
                                    <p>{proj.description}</p>
                                    {proj.stack && <p className="item-meta">Stack: {proj.stack}</p>}
                                </div>
                                <button 
                                    className="btn-icon" 
                                    onClick={() => handleRemove("projects", proj.id)}
                                    title="Remove"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        ))}
                        {projects.length === 0 && <p className="text-muted">No projects added yet.</p>}
                    </div>
                </section>

                {/* 5. Certificates Section */}
                <section className="section-card">
                    <div className="section-header">
                        <h2 className="section-title">Certificates & Documents</h2>
                        <button className="btn-add" onClick={() => openModal("Certificates")}>
                            + Add Document
                        </button>
                    </div>
                    <div className="item-list">
                        {certificates.map((cert) => (
                            <div key={cert.id} className="list-item">
                                <div className="item-content">
                                    <h3>{cert.name}</h3>
                                    <p className="item-meta">Uploaded: {cert.date}</p>
                                    {cert.fileUrl && (
                                        <a 
                                            href={cert.fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="view-link"
                                            style={{ fontSize: '0.85rem', color: 'var(--color-accent-primary)', textDecoration: 'none', display: 'inline-block', marginTop: '0.25rem' }}
                                        >
                                            View Document &rarr;
                                        </a>
                                    )}
                                </div>
                                <button 
                                    className="btn-icon" 
                                    onClick={() => handleRemove("certificates", cert.id)}
                                    title="Remove"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        ))}
                         {certificates.length === 0 && <p className="text-muted">No certificates added yet.</p>}
                    </div>
                </section>

                {/* Modal Component */}
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={closeModal} 
                    title={`Add ${activeSection}`}
                >
                    {activeSection === "Education" && <EducationForm onClose={closeModal} />}
                    {activeSection === "Skills" && <SkillsForm onClose={closeModal} />}
                    {activeSection === "Projects" && <ProjectsForm onClose={closeModal} />}
                    {activeSection === "Certificates" && <CertificatesForm onClose={closeModal} />}
                </Modal>
            </div>
        </div>
    );
}

