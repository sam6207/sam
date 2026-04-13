import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
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
    if (!form.email.includes("@")) {
      showPopup("Please enter a valid email address!");
      return;
    }
    if (form.password.length < 5) {
      showPopup("Password must be at least 5 characters!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        showPopup("Account created successfully! Redirecting to login...", "success");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showPopup(data.error || "Signup failed. Please try again.");
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
          <p>Create a new account</p>
        </div>

        <h2 className="form-title">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Choose a username"
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email address"
            />
          </div>
          <div className="field">
            <label>
              Password{" "}
              <span style={{ color: "#718096", fontWeight: 400 }}>
                (min 5 characters)
              </span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Create a password"
            />
            <div className="pass-strength">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`bar ${
                    form.password.length >= i
                      ? form.password.length >= 8
                        ? "strong"
                        : form.password.length >= 5
                        ? "medium"
                        : "weak"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary">Create Account</button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="btn-secondary" onClick={() => navigate("/login")}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}