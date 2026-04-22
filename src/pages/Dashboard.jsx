import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/interview/history");
        setHistory(res.data.data);
      } catch (err) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const scoreColor = (pct) => {
    if (pct >= 80) return "#4ade80";
    if (pct >= 50) return "#facc15";
    return "#f87171";
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Welcome back, {user?.name}</h1>
        <p style={s.sub}>{user?.email}</p>

        <button
          onClick={() => navigate("/interview")}
          style={s.btn}
        >
          Start New Mock Interview
        </button>
      </div>

      {/* History */}
      <div style={{ ...s.card, marginTop: "24px" }}>
        <h2 style={s.sectionTitle}>Past Interviews</h2>

        {loading && <p style={s.hint}>Loading history...</p>}

        {!loading && history.length === 0 && (
          <p style={s.hint}>
            No interviews yet. Start your first mock interview above.
          </p>
        )}

        {history.map((session) => (
          <div key={session._id} style={s.sessionRow}>
            <div>
              <p style={s.sessionTitle}>
                {session.company} · {session.role}
              </p>
              <p style={s.sessionSub}>
                {session.difficulty} ·{" "}
                {new Date(session.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div style={s.sessionScore}>
              <span style={{
                ...s.scoreValue,
                color: scoreColor(session.percentage)
              }}>
                {session.totalScore}/50
              </span>
              <span style={{
                fontSize: "12px",
                color: scoreColor(session.percentage)
              }}>
                {session.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const s = {
  page:         { minHeight:"100vh", background:"#0f0f1a", padding:"32px 16px" },
  card:         { background:"#1e1e2e", borderRadius:"12px", padding:"36px",
          maxWidth:"860px", margin:"0 auto" },
  title:        { color:"#a78bfa", fontSize:"24px",
                  fontWeight:"700", marginBottom:"4px" },
  sub:          { color:"#888", fontSize:"14px", marginBottom:"20px" },
  sectionTitle: { color:"#fff", fontSize:"16px",
                  fontWeight:"600", marginBottom:"16px" },
  btn:          { width:"100%", padding:"12px", background:"#a78bfa",
                  border:"none", borderRadius:"8px", color:"#fff",
                  fontSize:"15px", fontWeight:"600", cursor:"pointer" },
  hint:         { color:"#666", fontSize:"13px", textAlign:"center",
                  padding:"20px 0" },
  sessionRow:   { display:"flex", justifyContent:"space-between",
                  alignItems:"center", padding:"14px",
                  background:"#2a2a3e", borderRadius:"8px",
                  marginBottom:"10px" },
  sessionTitle: { color:"#fff", fontSize:"14px",
                  fontWeight:"500", margin:"0 0 4px" },
  sessionSub:   { color:"#888", fontSize:"12px", margin:0 },
  sessionScore: { textAlign:"right" },
  scoreValue:   { fontSize:"20px", fontWeight:"700",
                  display:"block" },
};

export default Dashboard;