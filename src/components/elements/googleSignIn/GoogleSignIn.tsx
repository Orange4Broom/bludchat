import React, { useEffect } from "react";
import { useGoogleSignIn } from "@hooks/useGoogleSignIn";
import { Icon } from "@elements/icon/Icon";
import AOS from "aos";
import "aos/dist/aos.css";

export const GoogleSignIn: React.FC = () => {
  const { signInWithGoogle, loading } = useGoogleSignIn();

  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <div className="heropage">
      <div className="heropage__top" data-aos="fade-down">
        <h1 className="heropage__header">Welcome to BludChat 👋</h1>
        <p className="heropage__paragraph">My first chatting web application</p>
      </div>
      <div className="heropage__line" data-aos="fade-up"></div>
      <div className="heropage__mid" data-aos="fade-right">
        <h1 className="heropage__signin__header">Sign In / Sign Up</h1>
        <button
          className="heropage__signin__button"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          <Icon name="google" type="fab" />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
      <div className="heropage__bottom" data-aos="fade-left">
        <h1 className="heropage__github__header">My GitHub account</h1>
        <button
          className="heropage__github__button"
          onClick={() =>
            window.open("https://github.com/Orange4Broom", "_blank")
          }
        >
          <Icon name="github" type="fab" />
          Checkout my account
        </button>
      </div>
    </div>
  );
};
