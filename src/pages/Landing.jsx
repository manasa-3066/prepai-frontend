import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user }  = useAuth();

  const features = [
    {
      icon: "🎯",
      title: "Mock Interview",
      desc: "Company-specific AI interviews with real-time feedback. Practice for Google, Amazon, TCS and more.",
      color: "#a78bfa",
    },
    {
      icon: "📊",
      title: "Skill Gap Analyser",
      desc: "Upload your resume and a job description. AI tells you exactly what skills you are missing.",
      color: "#4ade80",
    },
    {
      icon: "📚",
      title: "Study Assistant",
      desc: "Upload your notes and ask questions. AI answers based on your own study material.",
      color: "#facc15",
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      desc: "Every interview is scored and saved. Track your improvement over time on your dashboard.",
      color: "#f87171",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Create your account",
      desc: "Sign up for free. No credit card needed.",
    },
    {
      num: "02",
      title: "Choose your target",
      desc: "Select the company and role you are preparing for.",
    },
    {
      num: "03",
      title: "Practice and improve",
      desc: "Get AI feedback on every answer. Track your score over time.",
    },
  ];

  const stats = [
    { value: "15+", label: "Companies covered" },
    { value: "8",   label: "Job roles" },
    { value: "AI",  label: "Powered feedback" },
    { value: "100%", label: "Free to use" },
  ];

  return (
    <div style={s.page}>

      {/* ── Navbar ── */}
      <nav style={s.nav}>
        <span style={s.brand}>PrepAI</span>
        <div style={s.navLinks}>
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              style={s.navBtn}
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                style={s.navGhost}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                style={s.navBtn}
              >
                Get Started Free
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroBadge}>
            AI-Powered Placement Preparation
          </div>
          <h1 style={s.heroTitle}>
            Everything You Need to{" "}
            <span style={s.heroHighlight}>Land Your Dream Job</span>
          </h1>
          <p style={s.heroSub}>
            Mock interviews, skill gap analysis, and AI study assistant —
            all in one platform. Built for students, by a student.
          </p>
          <div style={s.heroBtns}>
            <button
              onClick={() => navigate(user ? "/interview" : "/register")}
              style={s.heroBtn}
            >
              Start Practicing Free
            </button>
            <button
              onClick={() => navigate(user ? "/skillgap" : "/register")}
              style={s.heroGhost}
            >
              Analyse Your Resume
            </button>
          </div>
        </div>

        {/* Hero visual */}
        <div style={s.heroCard}>
          <div style={s.heroCardHeader}>
            <span style={s.heroCardDot1}/>{" "}
            <span style={s.heroCardDot2}/>{" "}
            <span style={s.heroCardDot3}/>
          </div>
          <p style={s.heroCardLabel}>Mock Interview — Google · Frontend</p>
          <div style={s.heroCardQ}>
            <p style={s.heroCardQLabel}>Question 2 of 5</p>
            <p style={s.heroCardQText}>
              Explain how React's virtual DOM works and why it improves performance.
            </p>
          </div>
          <div style={s.heroCardScore}>
            <div style={s.heroCardScoreItem}>
              <span style={{ color:"#4ade80", fontSize:"20px",
                fontWeight:"700" }}>8</span>
              <span style={s.heroCardScoreLabel}>/ 10</span>
            </div>
            <div style={{ flex:1 }}>
              <p style={s.heroCardFeedback}>
                Strong explanation with good examples. Consider mentioning
                the diffing algorithm for a complete answer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={s.statsSection}>
        {stats.map((stat, i) => (
          <div key={i} style={s.statItem}>
            <span style={s.statValue}>{stat.value}</span>
            <span style={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>Everything you need to prepare</h2>
        <p style={s.sectionSub}>
          Four powerful tools working together to get you placement ready
        </p>
        <div style={s.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} style={s.featureCard}>
              <div style={{
                ...s.featureIcon,
                background: f.color + "22",
              }}>
                {f.icon}
              </div>
              <h3 style={{ ...s.featureTitle, color: f.color }}>
                {f.title}
              </h3>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ ...s.section, background:"#0d0d1a" }}>
        <h2 style={s.sectionTitle}>How it works</h2>
        <p style={s.sectionSub}>Get started in under 2 minutes</p>
        <div style={s.stepsRow}>
          {steps.map((step, i) => (
            <div key={i} style={s.stepCard}>
              <span style={s.stepNum}>{step.num}</span>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
              {i < steps.length - 1 && (
                <div style={s.stepArrow}>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.ctaSection}>
        <h2 style={s.ctaTitle}>Ready to start preparing?</h2>
        <p style={s.ctaSub}>
          Join students who are using PrepAI to land their dream jobs
        </p>
        <button
          onClick={() => navigate(user ? "/dashboard" : "/register")}
          style={s.ctaBtn}
        >
          {user ? "Go to Dashboard" : "Create Free Account"}
        </button>
      </section>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <span style={s.footerBrand}>PrepAI</span>
        <span style={s.footerText}>
          Built with React, Node.js, MongoDB and Groq AI
        </span>
      </footer>

    </div>
  );
};

const s = {
  page:              { background:"#0f0f1a", minHeight:"100vh", color:"#fff" },

  // Navbar
  nav:               { display:"flex", justifyContent:"space-between",
                       alignItems:"center", padding:"18px 48px",
                       borderBottom:"1px solid #1e1e2e" },
  brand:             { fontSize:"22px", fontWeight:"800", color:"#a78bfa" },
  navLinks:          { display:"flex", gap:"12px", alignItems:"center" },
  navGhost:          { background:"transparent", border:"1px solid #3a3a5e",
                       color:"#ccc", padding:"8px 20px", borderRadius:"8px",
                       cursor:"pointer", fontSize:"14px" },
  navBtn:            { background:"#a78bfa", border:"none", color:"#fff",
                       padding:"8px 20px", borderRadius:"8px",
                       cursor:"pointer", fontSize:"14px", fontWeight:"600" },

  // Hero
  hero:              { display:"flex", alignItems:"center", gap:"48px",
                       padding:"80px 48px", maxWidth:"1200px",
                       margin:"0 auto" },
  heroInner:         { flex:1 },
  heroBadge:         { display:"inline-block", background:"#a78bfa22",
                       border:"1px solid #a78bfa44", color:"#a78bfa",
                       padding:"6px 16px", borderRadius:"20px",
                       fontSize:"13px", fontWeight:"500", marginBottom:"24px" },
  heroTitle:         { fontSize:"48px", fontWeight:"800", lineHeight:"1.2",
                       marginBottom:"20px", color:"#fff" },
  heroHighlight:     { color:"#a78bfa" },
  heroSub:           { color:"#888", fontSize:"18px", lineHeight:"1.7",
                       marginBottom:"32px", maxWidth:"480px" },
  heroBtns:          { display:"flex", gap:"16px" },
  heroBtn:           { padding:"14px 28px", background:"#a78bfa",
                       border:"none", borderRadius:"10px", color:"#fff",
                       fontSize:"16px", fontWeight:"600", cursor:"pointer" },
  heroGhost:         { padding:"14px 28px", background:"transparent",
                       border:"1px solid #3a3a5e", borderRadius:"10px",
                       color:"#ccc", fontSize:"16px", cursor:"pointer" },

  // Hero card
  heroCard:          { flex:1, background:"#1e1e2e", borderRadius:"16px",
                       padding:"24px", maxWidth:"420px",
                       border:"1px solid #2a2a5e" },
  heroCardHeader:    { display:"flex", gap:"6px", marginBottom:"16px" },
  heroCardDot1:      { width:"10px", height:"10px", borderRadius:"50%",
                       background:"#f87171", display:"inline-block" },
  heroCardDot2:      { width:"10px", height:"10px", borderRadius:"50%",
                       background:"#facc15", display:"inline-block" },
  heroCardDot3:      { width:"10px", height:"10px", borderRadius:"50%",
                       background:"#4ade80", display:"inline-block" },
  heroCardLabel:     { color:"#a78bfa", fontSize:"12px", fontWeight:"600",
                       marginBottom:"16px", textTransform:"uppercase",
                       letterSpacing:".05em" },
  heroCardQ:         { background:"#12122a", borderRadius:"10px",
                       padding:"16px", marginBottom:"16px" },
  heroCardQLabel:    { color:"#666", fontSize:"11px", marginBottom:"8px" },
  heroCardQText:     { color:"#e2e8f0", fontSize:"14px", lineHeight:"1.6",
                       margin:0 },
  heroCardScore:     { display:"flex", gap:"16px", alignItems:"flex-start",
                       background:"#12122a", borderRadius:"10px",
                       padding:"16px" },
  heroCardScoreItem: { textAlign:"center", flexShrink:0 },
  heroCardScoreLabel:{ color:"#666", fontSize:"12px", display:"block" },
  heroCardFeedback:  { color:"#888", fontSize:"12px",
                       lineHeight:"1.6", margin:0 },

  // Stats
  statsSection:      { display:"flex", justifyContent:"center", gap:"64px",
                       padding:"48px", background:"#1e1e2e",
                       borderTop:"1px solid #2a2a3e",
                       borderBottom:"1px solid #2a2a3e" },
  statItem:          { textAlign:"center" },
  statValue:         { display:"block", fontSize:"36px", fontWeight:"800",
                       color:"#a78bfa", marginBottom:"4px" },
  statLabel:         { color:"#888", fontSize:"14px" },

  // Features
  section:           { padding:"80px 48px", maxWidth:"1200px",
                       margin:"0 auto" },
  sectionTitle:      { fontSize:"32px", fontWeight:"700", color:"#fff",
                       textAlign:"center", marginBottom:"12px" },
  sectionSub:        { color:"#888", fontSize:"16px", textAlign:"center",
                       marginBottom:"48px" },
  featuresGrid:      { display:"grid",
                       gridTemplateColumns:"repeat(2, 1fr)", gap:"24px" },
  featureCard:       { background:"#1e1e2e", borderRadius:"12px",
                       padding:"28px", border:"1px solid #2a2a3e" },
  featureIcon:       { width:"48px", height:"48px", borderRadius:"12px",
                       display:"flex", alignItems:"center",
                       justifyContent:"center", fontSize:"24px",
                       marginBottom:"16px" },
  featureTitle:      { fontSize:"18px", fontWeight:"600",
                       marginBottom:"10px" },
  featureDesc:       { color:"#888", fontSize:"14px", lineHeight:"1.7",
                       margin:0 },

  // How it works
  stepsRow:          { display:"flex", gap:"0", position:"relative",
                       maxWidth:"900px", margin:"0 auto" },
  stepCard:          { flex:1, textAlign:"center", padding:"32px 24px",
                       position:"relative" },
  stepNum:           { display:"block", fontSize:"48px", fontWeight:"800",
                       color:"#a78bfa22", marginBottom:"12px" },
  stepTitle:         { color:"#fff", fontSize:"18px", fontWeight:"600",
                       marginBottom:"10px" },
  stepDesc:          { color:"#888", fontSize:"14px", lineHeight:"1.6" },
  stepArrow:         { position:"absolute", right:"-12px", top:"40px",
                       color:"#3a3a5e", fontSize:"24px" },

  // CTA
  ctaSection:        { textAlign:"center", padding:"80px 48px",
                       background:"#1e1e2e",
                       borderTop:"1px solid #2a2a3e" },
  ctaTitle:          { fontSize:"36px", fontWeight:"700",
                       color:"#fff", marginBottom:"16px" },
  ctaSub:            { color:"#888", fontSize:"16px",
                       marginBottom:"32px" },
  ctaBtn:            { padding:"16px 40px", background:"#a78bfa",
                       border:"none", borderRadius:"10px", color:"#fff",
                       fontSize:"18px", fontWeight:"600", cursor:"pointer" },

  // Footer
  footer:            { display:"flex", justifyContent:"space-between",
                       alignItems:"center", padding:"24px 48px",
                       borderTop:"1px solid #1e1e2e" },
  footerBrand:       { color:"#a78bfa", fontWeight:"700", fontSize:"16px" },
  footerText:        { color:"#444", fontSize:"13px" },
};

export default Landing;