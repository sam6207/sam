import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const showPopup = (message, type = "error") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) {
      showPopup("Username is required!");
      return;
    }
    if (form.password.length < 5) {
      showPopup("Password must be at least 5 characters!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        showPopup("Login successful! Redirecting...", "success");
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        showPopup(data.error || "Wrong username or password!");
      }
    } catch {
      showPopup("Could not connect to server. Is the backend running?");
    }
  };

  return (
    <div className="auth-wrap">

      {popup.show && (
        <div className="popup-overlay">
          <div className={`popup-box ${popup.type}`}>
            <div className="popup-icon">
              {popup.type === "success" ? "✓" : "✕"}
            </div>
            <p>{popup.message}</p>
          </div>
        </div>
      )}

      <div className="auth-card">
        <div className="brand">
          <div className="brand-logo">SAM</div>
          <p>Sales & Account Manager</p>
        </div>

        <h2 className="form-title">Login to your account</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter your username"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password (min 5 chars)"
            />
          </div>
          <button type="submit" className="btn-primary">Login</button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="btn-secondary" onClick={() => navigate("/signup")}>
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
}