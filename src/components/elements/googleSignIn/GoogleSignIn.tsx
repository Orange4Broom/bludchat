import { getAuth, signInWithPopup } from "firebase/auth";
import { app, provider } from "../../../firebase/firebase";

export const GoogleSignIn: React.FC = () => {
  const auth = getAuth(app);
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
};
