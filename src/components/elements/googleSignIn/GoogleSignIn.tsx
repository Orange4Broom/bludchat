import React from "react";
import { useGoogleSignIn } from "../../../hooks/useGoogleSignIn";

export const GoogleSignIn: React.FC = () => {
  const { signInWithGoogle, loading } = useGoogleSignIn();

  return (
    <button onClick={signInWithGoogle} disabled={loading}>
      {loading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};
