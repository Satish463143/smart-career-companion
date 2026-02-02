import React, { useState, useEffect } from 'react';
import { auth } from "../../../firebase"; // Adjust path as needed
import { useNavigate } from 'react-router-dom';
import './AiFeature.css';

export default function AiFeature() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'career' | 'resume'
    const navigate = useNavigate();

    // --- State for Features ---
    // Chat
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hello! I'm your AI Career Companion. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);

    // Career
    const [careerResult, setCareerResult] = useState(null);
    const [careerLoading, setCareerLoading] = useState(false);

    // Resume
    const [resumeLoading, setResumeLoading] = useState(false);

    // --- Auth Check ---
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // If not logged in, redirect to login
                 navigate('/login'); 
                 // Or we could show a "Please Login" state here if we don't want to redirect immediately
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    if (loading) return <div className="ai-container">Loading...</div>;
    if (!user) return null; // Should have redirected

    // --- Handlers ---

    // 1. AI Chat
    const handleSendMessage = async () => {
        if (!input.trim()) return;
        
        const newMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, newMsg]);
        setInput("");
        setChatLoading(true);

        try {
            const token = user ? await user.getIdToken() : "";
            const res = await fetch("http://localhost:9005/ai/aiChat", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId: user.uid, message: input })
            });
            const data = await res.json();
            
            if (res.ok) {
                 setMessages(prev => [...prev, { role: 'ai', content: data.result.aiResponse }]);
            } else {
                 setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please try again." }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', content: "Network error. Please check your connection." }]);
        } finally {
            setChatLoading(false);
        }
    };

    // 2. Career Recommendation
    const handleGetRecommendation = async () => {
        setCareerLoading(true);
        try {
            const token = user ? await user.getIdToken() : "";
            const res = await fetch("http://localhost:9005/ai/careerRecommendation", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId: user.uid })
            });
            const data = await res.json();
            if (res.ok) {
                setCareerResult(data.result.recommendation);
            } else {
                alert("Failed to get recommendation: " + data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Network error.");
        } finally {
            setCareerLoading(false);
        }
    };

    // 3. Resume Generator
    const handleGenerateResume = async () => {
        setResumeLoading(true);
        try {
            const token = user ? await user.getIdToken() : "";
            const res = await fetch("http://localhost:9005/ai/resumeGenerator", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId: user.uid })
            });
            const data = await res.json();
            
            if (res.ok && data.result.pdfBase64) {
               // Trigger Download
               const link = document.createElement("a");
               link.href = `data:application/pdf;base64,${data.result.pdfBase64}`;
               link.download = data.result.fileName || "Resume.pdf";
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
            } else {
                alert("Failed to generate resume: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Network error.");
        } finally {
            setResumeLoading(false);
        }
    };


    return (
        <div className="ai-container">
            {/* Sidebar Navigation */}
            <div className="ai-sidebar">
                <h2>AI Tools</h2>
                <button 
                    className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chat')}
                >
                    💬 AI Chat Assistant
                </button>
                <button 
                    className={`nav-btn ${activeTab === 'career' ? 'active' : ''}`}
                    onClick={() => setActiveTab('career')}
                >
                   🚀 Career Path Advisor
                </button>
                <button 
                    className={`nav-btn ${activeTab === 'resume' ? 'active' : ''}`}
                    onClick={() => setActiveTab('resume')}
                >
                    📄 Resume Generator
                </button>
            </div>

            {/* Main Content */}
            <div className="ai-content">
                
                {activeTab === 'chat' && (
                    <>
                        <div className="feature-header">
                            <h1>Career Assistant Chat</h1>
                            <p>Ask anything about your career, skills, or job market trends.</p>
                        </div>
                        <div className="chat-window">
                            <div className="chat-messages">
                                {messages.map((m, i) => (
                                    <div key={i} className={`message ${m.role}`}>
                                        {m.content}
                                    </div>
                                ))}
                                {chatLoading && <div className="message ai">Thinking...</div>}
                            </div>
                            <div className="chat-input-area">
                                <input 
                                    type="text" 
                                    className="chat-input" 
                                    placeholder="Type your question..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button className="hero-btn" onClick={handleSendMessage} disabled={chatLoading}>
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'career' && (
                    <>
                        <div className="feature-header">
                            <h1>AI Career Recommendations</h1>
                            <p>Get personalized career advice based on your profile (Education, Skills, Projects).</p>
                        </div>
                        
                        {!careerResult ? (
                            <div className="action-card">
                                <h3>Ready to discover your path?</h3>
                                <p style={{marginBottom: '1.5rem', color: '#6b7280'}}>
                                    Our AI analyzes your entire profile to suggest the best roles, identify skill gaps, and recommend next steps.
                                </p>
                                <button className="hero-btn" onClick={handleGetRecommendation} disabled={careerLoading}>
                                    {careerLoading ? "Analyzing Profile..." : "Get Recommendations"}
                                </button>
                            </div>
                        ) : (
                            <div className="result-container">
                                <div className="recommendation-result">
                                    {careerResult}
                                </div>
                                <button 
                                    className="nav-btn" 
                                    style={{marginTop: '1rem', background: '#e5e7eb', justifyContent: 'center'}}
                                    onClick={() => setCareerResult(null)}
                                >
                                    Start Over
                                </button>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'resume' && (
                    <>
                        <div className="feature-header">
                            <h1>Smart Resume Generator</h1>
                            <p>Instantly generate a professional PDF resume tailored to industry standards.</p>
                        </div>

                        <div className="action-card">
                            <div style={{fontSize: '4rem', marginBottom: '1rem'}}>📄</div>
                            <h3>Create your Professional Resume</h3>
                            <p style={{marginBottom: '1.5rem', color: '#6b7280'}}>
                                We'll check your summary, experience, and skills to build a clean, ATS-friendly PDF resume.
                            </p>
                            <button className="hero-btn" onClick={handleGenerateResume} disabled={resumeLoading}>
                                {resumeLoading ? "Generating PDF..." : "Download Resume"}
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}