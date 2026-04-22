import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Login = () => {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);
      login(response.data.user, response.data.token);
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome back</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            style={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.switchText}>
          No account yet? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display:"flex", justifyContent:"center",
               alignItems:"center", minHeight:"90vh", background:"#0f0f1a" },
  card:      { background:"#1e1e2e", padding:"40px", borderRadius:"12px",
               width:"100%", maxWidth:"400px" },
  title:     { color:"#fff", marginBottom:"24px", textAlign:"center" },
  input:     { width:"100%", padding:"12px", marginBottom:"16px",
               background:"#2a2a3e", border:"1px solid #3a3a5e",
               borderRadius:"8px", color:"#fff", fontSize:"14px",
               boxSizing:"border-box" },
  button:    { width:"100%", padding:"12px", background:"#a78bfa",
               border:"none", borderRadius:"8px", color:"#fff",
               fontSize:"16px", cursor:"pointer", fontWeight:"600" },
  error:     { color:"#f87171", marginBottom:"16px",
               textAlign:"center", fontSize:"14px" },
  switchText:{ color:"#888", textAlign:"center",
               marginTop:"16px", fontSize:"14px" },
};

export default Login;