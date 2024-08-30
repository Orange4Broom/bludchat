import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/App";
import "@/index.scss";

import AOS from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";

AOS.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
