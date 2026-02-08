import React, { useState } from 'react';
import { db, auth, storage } from '../../../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfileForm({ onClose, initialData }) {
    const [name, setName] = useState(initialData?.displayName || initialData?.name || '');
    const [file, setFile] = useState(null);
    const [portfolio, setPortfolio] = useState(initialData?.portfolio || '');
    const [gitHub, setGitHub] = useState(initialData?.gitHub || '');
    const [linkedIn, setLinkedIn] = useState(initialData?.linkedIn || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        // Validation
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(selected.type)) {
            setError("Invalid file type. Please upload JPG, PNG.");
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
                const storageRef = ref(storage, `users/${user.uid}/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                fileUrl = await getDownloadURL(snapshot.ref);
                filePath = snapshot.metadata.fullPath;
            }

            // Construct update object safely
            const updateData = {
                displayName: name,
                name,
                portfolio,
                gitHub,
                linkedIn,
                updatedAt: serverTimestamp()
            };

            // Only add photoURL if a new file was uploaded
            if (fileUrl) {
                updateData.photoURL = fileUrl;
                updateData.filePath = filePath;
            }

            await setDoc(doc(db, "users", user.uid), updateData, { merge: true });
            onClose();
        } catch (err) {
            console.error("Error updating profile: ", err);
            setError("Failed to save profile. " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form" style={{ padding: 0 }}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <label className="form-label">Name</label>
                <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. User Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Portfolio URL</label>
                <input 
                    type="url" 
                    className="form-input"
                    placeholder="e.g. https://user.com"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="form-label">GitHub Profile URL</label>
                <input 
                    type="url" 
                    className="form-input"
                    placeholder="e.g. https://github.com/"
                    value={gitHub}
                    onChange={(e) => setGitHub(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label">LinkedIn Profile URL</label>
                <input 
                    type="url" 
                    className="form-input"
                    placeholder="e.g. https://www.linkedin.com/in/"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Upload Profile Picture (Max 2MB)</label>
                <input 
                    type="file" 
                    className="form-input"
                    accept=".jpg,.png"
                    onChange={handleFileChange}
                />
                <small className="text-muted" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Supported: JPG, PNG
                </small>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Uploading & Saving...' : 'Update Profile'}
            </button>
        </form>
    );
}
