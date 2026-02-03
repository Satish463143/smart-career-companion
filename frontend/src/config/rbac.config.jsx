import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AdminRoute = ({ children }) => {  
    const [isAdmin, setIsAdmin] = useState(null); // null = unknown/loading, false = restricted, true = allowed
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const token = await currentUser.getIdTokenResult();
                    if (token.claims.role === "admin") {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error("Error checking admin status:", error);
                    setIsAdmin(false);
                }
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="loading-screen">Loading...</div>; 
    }

    if (!user) {
        // Not logged in -> Go to Login
        alert("Please login to view this page");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        // Logged in but not admin -> Go to Home
        alert("You are not authorized to access this page");
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
