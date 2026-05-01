import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>PrepAI</span>
      <div style={styles.links}>
        {user ? (
          <>
            <span style={styles.welcome}>Hi, {user.name}</span>
            <Link to="/dashboard"  style={styles.link}>Dashboard</Link>
            <Link to="/interview"  style={styles.link}>Mock Interview</Link>
            <Link to="/skillgap"   style={styles.link}>Skill Gap</Link>
            <Link to="/chatbot" style={styles.link}>Study Assistant</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav:     { display:"flex", justifyContent:"space-between",
             alignItems:"center", padding:"12px 24px",
             background:"#1e1e2e", color:"#fff" },
  brand:   { fontSize:"20px", fontWeight:"700", color:"#a78bfa" },
  links:   { display:"flex", alignItems:"center", gap:"4px" },
  link:    { color:"#ccc", marginLeft:"12px", textDecoration:"none",
             fontSize:"14px" },
  button:  { marginLeft:"16px", padding:"6px 14px", background:"#a78bfa",
             border:"none", borderRadius:"6px", color:"#fff",
             cursor:"pointer", fontSize:"13px" },
  welcome: { color:"#a78bfa", fontSize:"14px", marginRight:"8px" },
};

export default Navbar;