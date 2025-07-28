import React, { useState } from "react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import defaultInstance from '../../api/defaultInstance';
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "../store/slices/authSlice"

const LoginModal = ({ open, onClose, email, setEmail, password, setPassword, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!open) return null;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await defaultInstance.post('/login', { email, password });
      if (!response.data.token) {

        throw new Error('No token received from server');
      }
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userData', JSON.stringify(response.data.user));

      dispatch(login({
        email,
        token: response.data.token,
        user: response.data.user
      }));

      if (onLoginSuccess) onLoginSuccess();
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 8,
          minWidth: 320,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>ავტორიზაცია</h2>
        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 12 }}>
            <label>ელ.ფოსტა</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                height: "40px",
                padding: "8px 36px 8px 8px",
                marginTop: 4,
                borderRadius: 4,
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: 16, position: "relative" }}>
            <label>პაროლი</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                height: "40px",
                padding: "8px 36px 8px 8px",
                marginTop: 4,
                borderRadius: 4,
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
            <span
              onClick={() => setShowPassword(prev => !prev)}
              style={{
                cursor: "pointer",
                position: "absolute",
                right: 12,
                top: 32,
                color: "#666",
                display: "flex",
                alignItems: "center",
                height: "24px",
              }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: 4,
                border: "none",
                background: "#eee",
                cursor: "pointer",
              }}
            >
              გაუქმება
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                borderRadius: 4,
                border: "none",
                background: "#017dbe",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              შესვლა
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;