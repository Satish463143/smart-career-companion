import { auth } from "../../../firebase";
import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Profile() {
  const saveProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Not logged in");
      return;
    }

    await setDoc(doc(db, "users", user.uid), {
      name: "Test User",
      email: user.email,
      skills: ["React", "Firebase"],
      createdAt: new Date()
    });

    alert("Profile saved in Firestore");
  };

  return <button onClick={saveProfile}>Save Profile</button>;
}
