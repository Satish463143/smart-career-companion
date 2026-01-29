
import { auth } from "./firebase"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./components/section/Login/Login";
import Profile from "./components/section/Login/Profile";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return user ? <Profile /> : <Login />;
}

export default App;
