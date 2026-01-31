import React, { useState } from 'react';
import { db, auth } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ProjectsForm({ onClose }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [stack, setStack] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const user = auth.currentUser;
        if (!user) {
            setError("You must be logged in.");
            setLoading(false);
            return;
        }

        try {
            await addDoc(collection(db, "users", user.uid, "projects"), {
                title,
                description,
                stack,
                createdAt: serverTimestamp()
            });
            onClose();
        } catch (err) {
            console.error("Error adding project: ", err);
            setError("Failed to save project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form" style={{ padding: 0 }}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <label className="form-label">Project Title</label>
                <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. Smart Career Companion"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                    className="form-input"
                    placeholder="Brief description of the project..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Tech Stack (Optional)</label>
                <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. React, Node.js, Firebase"
                    value={stack}
                    onChange={(e) => setStack(e.target.value)}
                />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Add Project'}
            </button>
        </form>
    );
}
