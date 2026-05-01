import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profile = () => {
  const { user }              = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/interview/history");
        setHistory(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const scoreColor = (pct) => {
    if (pct >= 80) return "#4ade80";
    if (pct >= 50) return "#facc15";
    return "#f87171";
  };

  const totalInterviews = history.length;
  const avgScore = totalInterviews > 0
    ? Math.round(history.reduce((sum, s) => sum + s.percentage, 0) / totalInterviews)
    : 0;
  const bestScore = totalInterviews > 0
    ? Math.max(...history.map(s => s.percentage))
    : 0;

  return (
    <div style={s.page}>

      {/* Profile header */}
      <div style={s.profileHeader}>
        <div style={s.avatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={s.name}>{user?.name}</h1>
          <p style={s.email}>{user?.email}</p>
        </div>
      </div>

      {/* Stats row */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <span style={s.statValue}>{totalInterviews}</span>
          <span style={s.statLabel}>Interviews taken</span>
        </div>
        <div style={s.statCard}>
          <span style={{
            ...s.statValue,
            color: scoreColor(avgScore)
          }}>
            {avgScore}%
          </span>
          <span style={s.statLabel}>Average score</span>
        </div>
        <div style={s.statCard}>
          <span style={{
            ...s.statValue,
            color: scoreColor(bestScore)
          }}>
            {bestScore}%
          </span>
          <span style={s.statLabel}>Best score</span>
        </div>
        <div style={s.statCard}>
          <span style={s.statValue}>
            {history.length > 0
              ? [...new Set(history.map(h => h.company))].length
              : 0}
          </span>
          <span style={s.statLabel}>Companies practised</span>
        </div>
      </div>

      {/* Interview history */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>Interview History</h2>

        {loading && <p style={s.hint}>Loading...</p>}

        {!loading && history.length === 0 && (
          <p style={s.hint}>
            No interviews yet. Start your first mock interview!
          </p>
        )}

        {history.map((session, i) => (
          <div key={i} style={s.sessionCard}
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <div style={s.sessionHeader}>
              <div>
                <p style={s.sessionTitle}>
                  {session.company} · {session.role}
                </p>
                <p style={s.sessionSub}>
                  {session.difficulty} ·{" "}
                  {new Date(session.createdAt).toLocaleDateString("en-IN", {
                    day:"numeric", month:"short", year:"numeric"
                  })}
                </p>
              </div>
              <div style={s.sessionRight}>
                <span style={{
                  ...s.sessionScore,
                  color: scoreColor(session.percentage)
                }}>
                  {session.totalScore}/50
                </span>
                <span style={{
                  fontSize:"12px",
                  color: scoreColor(session.percentage)
                }}>
                  {session.percentage}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={s.progressBar}>
              <div style={{
                ...s.progressFill,
                width: `${session.percentage}%`,
                background: scoreColor(session.percentage),
              }}/>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

const s = {
  page:          { minHeight:"100vh", background:"#0f0f1a",
                   padding:"32px 24px" },
  profileHeader: { display:"flex", alignItems:"center", gap:"20px",
                   maxWidth:"900px", margin:"0 auto 32px",
                   background:"#1e1e2e", borderRadius:"12px",
                   padding:"28px" },
  avatar:        { width:"72px", height:"72px", borderRadius:"50%",
                   background:"#a78bfa", display:"flex",
                   alignItems:"center", justifyContent:"center",
                   fontSize:"28px", fontWeight:"700", color:"#fff",
                   flexShrink:0 },
  name:          { color:"#fff", fontSize:"22px",
                   fontWeight:"700", marginBottom:"4px" },
  email:         { color:"#888", fontSize:"14px" },

  statsRow:      { display:"grid", gridTemplateColumns:"repeat(4,1fr)",
                   gap:"16px", maxWidth:"900px",
                   margin:"0 auto 24px" },
  statCard:      { background:"#1e1e2e", borderRadius:"10px",
                   padding:"20px", textAlign:"center" },
  statValue:     { display:"block", fontSize:"28px", fontWeight:"700",
                   color:"#a78bfa", marginBottom:"6px" },
  statLabel:     { color:"#888", fontSize:"12px" },

  card:          { background:"#1e1e2e", borderRadius:"12px",
                   padding:"28px", maxWidth:"900px", margin:"0 auto" },
  cardTitle:     { color:"#fff", fontSize:"18px",
                   fontWeight:"600", marginBottom:"20px" },
  hint:          { color:"#666", fontSize:"14px",
                   textAlign:"center", padding:"24px 0" },

  sessionCard:   { background:"#12122a", borderRadius:"8px",
                   padding:"16px", marginBottom:"10px",
                   cursor:"pointer", border:"1px solid #2a2a5e" },
  sessionHeader: { display:"flex", justifyContent:"space-between",
                   alignItems:"center", marginBottom:"12px" },
  sessionTitle:  { color:"#fff", fontSize:"14px",
                   fontWeight:"500", margin:"0 0 4px" },
  sessionSub:    { color:"#888", fontSize:"12px", margin:0 },
  sessionRight:  { textAlign:"right" },
  sessionScore:  { display:"block", fontSize:"20px", fontWeight:"700" },

  progressBar:   { height:"4px", background:"#2a2a3e", borderRadius:"2px" },
  progressFill:  { height:"100%", borderRadius:"2px",
                   transition:"width .4s" },
};

export default Profile;