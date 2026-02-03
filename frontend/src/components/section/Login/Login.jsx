import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Remove the immediate redirect check here to allow proper handling in handleLogin
  // or keep it but ensure handleLogin logic runs first? 
  // Actually, keeping this might redirect before we check status if state updates fast. 
  // Safe to remove for now or handle inside useEffect to check claims/status if we were doing advanced roles.
  // user object from auth doesn't have firestore data. 
  // existing code:
  // const user = auth.currentUser;
  // if(user){
  //   navigate('/profile');
  // } 
  // Retaining it might likely be fine if status check happens before auth state listener fires globally
  // but better to rely on handleLogin for the flow control.

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check User Status in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.status === 'inactive') {
          await signOut(auth);
          setError("Your account has been deactivated. Please contact admin.");
          setLoading(false);
          return;
        }
      }

      alert("Login successfully");
      navigate('/profile'); // Redirect to home on success
    } catch (err) {
        console.error("Login error:", err);
      // Clean up error message
      let msg = err.message;
      if (msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password')) {
        msg = "Invalid email or password";
      } else {
         msg = msg.replace('Firebase: ', '');
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Decorative Blobs */}
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>

      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue your journey</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
