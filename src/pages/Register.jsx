import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Register = () => {
  // One state object for all form fields
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState("");      // stores error message to show user
  const [loading, setLoading] = useState(false);   // disables button while request is in flight

  const { login } = useAuth();
  const navigate  = useNavigate();

  // This single function handles ALL input changes
  // e.target.name tells us which field changed (name, email, or password)
  // e.target.value is what the user typed
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();        // stops page from refreshing on form submit
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", form);

      // response.data is what your backend sent back
      // { success: true, token: "...", user: { id, name, email } }
      login(response.data.user, response.data.token);

      navigate("/dashboard");  // redirect to dashboard after register

    } catch (err) {
      // err.response.data.message is the error your backend sends
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);       // re-enable button whether request succeeded or failed
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create your account</h2>

        {/* Show error message if there is one */}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="name"           // must match the key in form state
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />
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
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            style={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display:"flex", justifyContent:"center",
             alignItems:"center", minHeight:"90vh", 
             background:"#0f0f1a", padding:"20px" },
  card:      { background:"#1e1e2e", padding:"48px", borderRadius:"12px",
             width:"100%", maxWidth:"480px" },
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

export default Register;