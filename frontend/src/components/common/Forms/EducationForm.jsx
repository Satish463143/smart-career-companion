import React, { useState } from 'react';
import { db, auth } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function EducationForm({ onClose }) {
    const [degree, setDegree] = useState('');
    const [institution, setInstitution] = useState('');
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const user = auth.currentUser;
        if (!user) {
            setError("You must be logged in to add education.");
            setLoading(false);
            return;
        }

        try {
            await addDoc(collection(db, "users", user.uid, "education"), {
                degree,
                institution,
                year,
                createdAt: serverTimestamp()
            });
            onClose(); // Close modal on success
        } catch (err) {
            console.error("Error adding document: ", err);
            setError("Failed to save education. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form" style={{ padding: 0 }}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <label className="form-label">Degree / Qualification</label>
                <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. Bachelor of Science in CS"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Institution / School</label>
                <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. Stanford University"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Year / Duration</label>
                <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. 2023 - 2027"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Add Education'}
            </button>
        </form>
    );
}
