import React, { useState } from 'react';
import { db, auth } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SkillsForm({ onClose }) {
    const [skillName, setSkillName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const user = auth.currentUser;
        if (!user) {
            setError("You must be logged in to add skills.");
            setLoading(false);
            return;
        }

        try {
            await addDoc(collection(db, "users", user.uid, "skills"), {
                name: skillName,
                createdAt: serverTimestamp()
            });
            onClose();
        } catch (err) {
            console.error("Error adding skill: ", err);
            setError("Failed to save skill.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form" style={{ padding: 0 }}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <label className="form-label">Skill Name</label>
                <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. React.js, Python, Leadership"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Add Skill' : 'Add Skill'}
            </button>
        </form>
    );
}
