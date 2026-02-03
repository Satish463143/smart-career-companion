import React, { useState, useEffect } from 'react';
import { auth, db } from "../../../firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import Modal from '../../common/Modal/Modal';
import EducationForm from '../../common/Forms/EducationForm';
import SkillsForm from '../../common/Forms/SkillsForm';
import ProjectsForm from '../../common/Forms/ProjectsForm';
import CertificatesForm from '../../common/Forms/CertificatesForm';
import ProfileForm from '../../common/Forms/ProfileForm';
import './Profile.css';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
    // --- State ---
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        if (loading) return; // Wait for auth check to complete
        
        if (!user) {
            // Only redirect if we know for sure there is no user and loading is done
            alert("Please login to view your profile");
            navigate('/login');
            return;
        }

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
        
        // Listener for Main Profile Data
        const unsubProfile = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
             if (docSnap.exists()) {
                 setUserProfile(docSnap.data());
             }
        });

        return () => {
            unsubEducation();
            unsubSkills();
            unsubProjects();
            unsubCertificates();
            unsubProfile();
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
    // Helper for user display (fallback if not logged in for dev preview, though likely won't load data)
    const displayUser = {
        displayName: userProfile?.displayName || userProfile?.name || user?.displayName || "Guest User",
        email: userProfile?.email || user?.email || "guest@example.com",
        photoURL: userProfile?.photoURL || user?.photoURL
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                
                {/* 1. Profile Header Section */}
                <section className="section-card profile-header-card">
                    <div className="profile-header-content">
                        <div className="profile-avatar">
                            {displayUser.photoURL ? (
                                <img src={displayUser.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                getInitials(displayUser.displayName || displayUser.email)
                            )}
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-name">
                                {displayUser.displayName || displayUser.email?.split('@')[0] || "User"}
                            </h1>
                            <p className="profile-email">{displayUser.email}</p>
                            <div className="profile-actions">
                                <button 
                                    className="btn-chat-ai"
                                    title="Start a chat with AI"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/></svg>
                                    <Link to="/ai-feature">Chat with AI</Link>
                                </button>
                                <button className="btn-edit-profile" onClick={() => openModal("Profile")}>
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>
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
                    title={`${activeSection === "Profile" ? "Edit" : "Add"} ${activeSection}`}
                >
                    {activeSection === "Education" && <EducationForm onClose={closeModal} />}
                    {activeSection === "Skills" && <SkillsForm onClose={closeModal} />}
                    {activeSection === "Projects" && <ProjectsForm onClose={closeModal} />}
                    {activeSection === "Certificates" && <CertificatesForm onClose={closeModal} />}
                    {activeSection === "Profile" && <ProfileForm onClose={closeModal} initialData={userProfile} />}
                </Modal>
            </div>
        </div>
    );
}

