import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to PrepAI</h1>
        <p style={styles.sub}>
          You are logged in as <span style={styles.highlight}>{user?.email}</span>
        </p>
        <div style={styles.infoBox}>
          <p style={styles.infoText}>Name: {user?.name}</p>
          <p style={styles.infoText}>User ID: {user?.id}</p>
        </div>
        <p style={styles.coming}>
          Interview generator, quiz, and skill gap analyser coming soon...
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display:"flex", justifyContent:"center",
               alignItems:"center", minHeight:"90vh", background:"#0f0f1a" },
  card:      { background:"#1e1e2e", padding:"40px", borderRadius:"12px",
               width:"100%", maxWidth:"500px", textAlign:"center" },
  title:     { color:"#a78bfa", fontSize:"28px", marginBottom:"12px" },
  sub:       { color:"#ccc", marginBottom:"24px" },
  highlight: { color:"#a78bfa", fontWeight:"600" },
  infoBox:   { background:"#2a2a3e", borderRadius:"8px",
               padding:"16px", marginBottom:"24px", textAlign:"left" },
  infoText:  { color:"#aaa", fontSize:"14px", margin:"4px 0" },
  coming:    { color:"#666", fontSize:"13px" },
};

export default Dashboard;