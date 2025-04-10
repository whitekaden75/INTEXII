import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId =
  "997332471205-49r2o2btqfcvl6jkfsihhcchh4guml6u.apps.googleusercontent.com"; // Replace with your actual client ID

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);

// Dynamically load GPT Engineer script after app mounts
const script = document.createElement("script");
script.src = "https://cdn.gpteng.co/gptengineer.js";
script.type = "module";
document.body.appendChild(script);
