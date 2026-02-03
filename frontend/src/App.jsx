
import { auth } from "./firebase"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./components/section/Login/Login";
import Profile from "./components/section/Login/Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import Signup from "./components/section/Login/Signup";
import AiFeature from "./components/section/AIFeataureSection/AiFeature";
import CMSLayout from "./pages/AdminPage/CMSLayout";
import Dashboard from "./components/CMS/Dashboard/Dashboard";
import User from "./components/CMS/User/user";
import AdminRoute from "./config/rbac.config";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="signup" element={<Signup />} />
          <Route path="ai-feature" element={<AiFeature />} />
        </Route>
        <Route path="/admin"  element={ <AdminRoute><CMSLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<User />} />
        </Route>          
      </Routes>
    </BrowserRouter>
  );
}

export default App;
