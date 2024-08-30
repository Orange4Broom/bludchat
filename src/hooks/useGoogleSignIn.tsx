import { useState } from "react";
import { getAuth, signInWithPopup } from "firebase/auth";
import { app, provider, firestore } from "@fbase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useToastify } from "@hooks/useToastify";

export const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const notify = useToastify().notify;

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
      notify("success", "Successfully signed in with Google");
    } catch (error) {
      notify("error", "Error signing in with Google:");
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading };
};
