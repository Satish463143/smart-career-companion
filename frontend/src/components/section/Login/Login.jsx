import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

export default function Login() {
  const login = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        "testuser@gmail.com",
        "Test@123"
      );
      alert("Login success");
    } catch (err) {
      alert(err.message);
    }
  };

  return <button onClick={login}>Login</button>;
}
