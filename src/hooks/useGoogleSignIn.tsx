import { useState } from "react";
import { getAuth, signInWithPopup } from "firebase/auth";
import { app, provider, firestore } from "@fbase/firebase";
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
          uid: user.uid,
          displayName: user.displayName || "Anonymous",
          email: user.email,
          photoURL: user.photoURL || "defaultProfilePictureUrl",
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
