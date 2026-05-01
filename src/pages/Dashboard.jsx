import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
  const { user }              = useAuth();
  const navigate              = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const avgScore = history.length > 0
    ? Math.round(history.reduce((s, h) => s + h.percentage, 0) / history.length)
    : null;

  const quickActions = [
    { icon:"🎯", label:"Mock Interview",    path:"/interview",
      color:"#a78bfa", desc:"Practice with AI" },
    { icon:"📊", label:"Skill Gap",         path:"/skillgap",
      color:"#4ade80", desc:"Analyse your resume" },
    { icon:"📚", label:"Study Assistant",   path:"/chatbot",
      color:"#facc15", desc:"Chat with your notes" },
    { icon:"👤", label:"My Profile",        path:"/profile",
      color:"#f87171", desc:"View your progress" },
  ];

  return (
    <div style={s.page}>

      {/* Welcome */}
      <div style={s.welcomeRow}>
        <div>
          <h1 style={s.title}>Welcome back, {user?.name} 👋</h1>
          <p style={s.sub}>Ready to prepare for your dream job today?</p>
        </div>
        {avgScore !== null && (
          <div style={s.avgBadge}>
            <span style={{ ...s.avgScore,
              color: scoreColor(avgScore) }}>
              {avgScore}%
            </span>
            <span style={s.avgLabel}>Average score</span>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={s.actionsGrid}>
        {quickActions.map((action, i) => (
          <div key={i} style={s.actionCard}
            onClick={() => navigate(action.path)}>
            <div style={{
              ...s.actionIcon,
              background: action.color + "22"
            }}>
              {action.icon}
            </div>
            <div>
              <p style={{ ...s.actionLabel,
                color: action.color }}>
                {action.label}
              </p>
              <p style={s.actionDesc}>{action.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent interviews */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <h2 style={s.cardTitle}>Recent Interviews</h2>
          <button
            onClick={() => navigate("/profile")}
            style={s.viewAll}
          >
            View all →
          </button>
        </div>

        {loading && <p style={s.hint}>Loading...</p>}

        {!loading && history.length === 0 && (
          <div style={s.emptyBox}>
            <p style={s.emptyIcon}>🎯</p>
            <p style={s.emptyTitle}>No interviews yet</p>
            <p style={s.emptyDesc}>
              Start your first mock interview to see your results here
            </p>
            <button
              onClick={() => navigate("/interview")}
              style={s.emptyBtn}
            >
              Start First Interview
            </button>
          </div>
        )}

        {history.slice(0, 5).map((session, i) => (
          <div key={i} style={s.sessionRow}>
            <div style={s.sessionLeft}>
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
        ))}
      </div>

    </div>
  );
};

const s = {
  page:          { minHeight:"100vh", background:"#0f0f1a",
                   padding:"32px 24px" },
  welcomeRow:    { display:"flex", justifyContent:"space-between",
                   alignItems:"center", maxWidth:"900px",
                   margin:"0 auto 32px" },
  title:         { color:"#fff", fontSize:"24px",
                   fontWeight:"700", marginBottom:"4px" },
  sub:           { color:"#888", fontSize:"14px" },
  avgBadge:      { background:"#1e1e2e", borderRadius:"12px",
                   padding:"16px 24px", textAlign:"center" },
  avgScore:      { display:"block", fontSize:"28px", fontWeight:"700" },
  avgLabel:      { color:"#888", fontSize:"12px" },

  actionsGrid:   { display:"grid", gridTemplateColumns:"repeat(4,1fr)",
                   gap:"16px", maxWidth:"900px",
                   margin:"0 auto 24px" },
  actionCard:    { background:"#1e1e2e", borderRadius:"12px",
                   padding:"20px", cursor:"pointer",
                   display:"flex", gap:"16px", alignItems:"center",
                   border:"1px solid #2a2a3e",
                   transition:"border-color .2s" },
  actionIcon:    { width:"44px", height:"44px", borderRadius:"10px",
                   display:"flex", alignItems:"center",
                   justifyContent:"center", fontSize:"20px",
                   flexShrink:0 },
  actionLabel:   { fontSize:"14px", fontWeight:"600", marginBottom:"2px" },
  actionDesc:    { color:"#888", fontSize:"12px" },

  card:          { background:"#1e1e2e", borderRadius:"12px",
                   padding:"28px", maxWidth:"900px", margin:"0 auto" },
  cardHeader:    { display:"flex", justifyContent:"space-between",
                   alignItems:"center", marginBottom:"20px" },
  cardTitle:     { color:"#fff", fontSize:"18px", fontWeight:"600" },
  viewAll:       { background:"transparent", border:"none",
                   color:"#a78bfa", cursor:"pointer", fontSize:"14px" },
  hint:          { color:"#666", fontSize:"14px",
                   textAlign:"center", padding:"24px 0" },

  emptyBox:      { textAlign:"center", padding:"40px 0" },
  emptyIcon:     { fontSize:"48px", marginBottom:"12px" },
  emptyTitle:    { color:"#fff", fontSize:"16px",
                   fontWeight:"600", marginBottom:"8px" },
  emptyDesc:     { color:"#888", fontSize:"14px", marginBottom:"20px" },
  emptyBtn:      { background:"#a78bfa", border:"none",
                   borderRadius:"8px", color:"#fff",
                   padding:"10px 24px", cursor:"pointer",
                   fontSize:"14px", fontWeight:"600" },

  sessionRow:    { display:"flex", justifyContent:"space-between",
                   alignItems:"center", padding:"14px",
                   background:"#12122a", borderRadius:"8px",
                   marginBottom:"8px" },
  sessionLeft:   {},
  sessionTitle:  { color:"#fff", fontSize:"14px",
                   fontWeight:"500", margin:"0 0 4px" },
  sessionSub:    { color:"#888", fontSize:"12px", margin:0 },
  sessionRight:  { textAlign:"right" },
  sessionScore:  { display:"block", fontSize:"20px", fontWeight:"700" },
};

export default Dashboard;