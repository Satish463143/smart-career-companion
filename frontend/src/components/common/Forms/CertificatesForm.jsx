import React, { useState } from 'react';
import { db, auth, storage } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function CertificatesForm({ onClose }) {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        // Validation
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(selected.type)) {
            setError("Invalid file type. Please upload PDF, DOC, JPG, PNG, or WEBP.");
            setFile(null);
            return;
        }

        if (selected.size > 2 * 1024 * 1024) { // 2MB
            setError("File size exceeds 2MB limit.");
            setFile(null);
            return;
        }

        setError(null);
        setFile(selected);
    };

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
            let fileUrl = "";
            let filePath = "";

            // Upload File if selected
            if (file) {
                const storageRef = ref(storage, `certificates/${user.uid}/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                fileUrl = await getDownloadURL(snapshot.ref);
                filePath = snapshot.metadata.fullPath;
            }

            await addDoc(collection(db, "users", user.uid, "certificates"), {
                name,
                date,
                fileUrl,
                filePath,
                createdAt: serverTimestamp()
            });
            onClose();
        } catch (err) {
            console.error("Error adding certificate: ", err);
            setError("Failed to save certificate. " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form" style={{ padding: 0 }}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <label className="form-label">Certificate / Document Name</label>
                <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. AWS Certified Practitioner"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Date / Year</label>
                <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. Jan 2025"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Upload File (Max 2MB)</label>
                <input 
                    type="file" 
                    className="form-input"
                    accept=".pdf,.doc,.docx,.jpg,.png,.webp"
                    onChange={handleFileChange}
                />
                <small className="text-muted" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Supported: PDF, DOCS, JPG, PNG, WEBP
                </small>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Uploading & Saving...' : 'Add Certificate'}
            </button>
        </form>
    );
}
