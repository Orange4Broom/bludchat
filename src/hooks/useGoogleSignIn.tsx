import { useState } from "react";
import { getAuth, signInWithPopup } from "firebase/auth";
import { app, provider, firestore } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

export const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        await setDoc(userRef, {
          id: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email,
          profilePicture: user.photoURL || "defaultProfilePictureUrl",
        });
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading };
};
