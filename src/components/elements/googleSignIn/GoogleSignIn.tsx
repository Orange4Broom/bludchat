import { getAuth, signInWithPopup } from "firebase/auth";
import { app, provider, firestore } from "../../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

export const GoogleSignIn: React.FC = () => {
  const auth = getAuth(app);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        await setDoc(userRef, {
          id: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email,
          profilePicture: user.photoURL || "defaultProfilePictureUrl", // Save profile picture URL
        });
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
};
