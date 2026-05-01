import { useState } from "react";
import api from "../api/axios";

const SkillGap = () => {
  const [resume, setResume]             = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult]             = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [expandedWeek, setExpandedWeek] = useState(null);

  const handleSubmit = async () => {
    if (!resume) {
      setError("Please upload your resume PDF");
      return;
    }
    if (jobDescription.trim().length < 50) {
      setError("Please paste the full job description (at least 50 characters)");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      // FormData is how we send files + text together in one request
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const res = await api.post("/skillgap/analyse", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const matchColor = (pct) => {
    if (pct >= 75) return "#4ade80";
    if (pct >= 50) return "#facc15";
    return "#f87171";
  };

  const importanceColor = (imp) => {
    if (imp === "critical")       return "#f87171";
    if (imp === "important")      return "#facc15";
    return "#888";
  };

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <h1 style={s.title}>Skill Gap Analyser</h1>
        <p style={s.sub}>
          Upload your resume and paste a job description — AI will tell you
          exactly what you are missing and how to close the gap.
        </p>
      </div>

      {/* Input card */}
      {!result && (
        <div style={s.card}>

          {/* Resume upload */}
          <div style={s.uploadBox}
            onClick={() => document.getElementById("resumeInput").click()}>
            <input
              id="resumeInput"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => setResume(e.target.files[0])}
            />
            <div style={s.uploadIcon}>📄</div>
            <p style={s.uploadTitle}>
              {resume ? resume.name : "Click to upload your Resume"}
            </p>
            <p style={s.uploadSub}>
              {resume
                ? `${(resume.size / 1024).toFixed(1)} KB — PDF ready`
                : "PDF only · Max 5MB"}
            </p>
          </div>

          {/* Job description */}
          <label style={s.label}>Job Description</label>
          <textarea
            style={s.textarea}
            placeholder="Paste the full job description here — include requirements, responsibilities, and skills..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
          />
          <p style={s.charCount}>{jobDescription.length} characters</p>

          {error && <p style={s.error}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={loading ? { ...s.btn, opacity: 0.7 } : s.btn}
          >
            {loading ? "Analysing your profile..." : "Analyse Skill Gap"}
          </button>

          {loading && (
            <p style={s.hint}>
              Reading your resume and comparing with job requirements...
              This takes about 10-15 seconds.
            </p>
          )}
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={s.resultsWrap}>

          {/* Overall match score */}
          <div style={s.matchCard}>
            <div style={s.matchLeft}>
              <p style={s.matchLabel}>Overall Match</p>
              <p style={{ ...s.matchScore,
                color: matchColor(result.overallMatch) }}>
                {result.overallMatch}%
              </p>
            </div>
            <div style={s.matchRight}>
              <p style={s.summaryText}>{result.summary}</p>
            </div>
          </div>

          {/* Two columns — matching + missing */}
          <div style={s.row}>

            {/* Matching skills */}
            <div style={s.skillCard}>
              <p style={{ ...s.sectionTitle, color: "#4ade80" }}>
                ✓ Matching Skills ({result.matchingSkills.length})
              </p>
              {result.matchingSkills.map((item, i) => (
                <div key={i} style={s.skillRow}>
                  <span style={s.skillName}>{item.skill}</span>
                  <span style={{
                    ...s.skillBadge,
                    background: item.level === "advanced" ? "#14532d"
                              : item.level === "intermediate" ? "#78350f"
                              : "#1e3a5f"
                  }}>
                    {item.level}
                  </span>
                </div>
              ))}
            </div>

            {/* Missing skills */}
            <div style={s.skillCard}>
              <p style={{ ...s.sectionTitle, color: "#f87171" }}>
                ✗ Missing Skills ({result.missingSkills.length})
              </p>
              {result.missingSkills.map((item, i) => (
                <div key={i} style={s.missingRow}>
                  <div style={s.missingTop}>
                    <span style={s.skillName}>{item.skill}</span>
                    <span style={{
                      ...s.skillBadge,
                      background: "transparent",
                      border: `1px solid ${importanceColor(item.importance)}`,
                      color: importanceColor(item.importance),
                    }}>
                      {item.importance}
                    </span>
                  </div>
                  <p style={s.missingReason}>{item.reason}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Strengths */}
          <div style={s.card}>
            <p style={s.sectionTitle}>Your Strengths</p>
            <div style={s.strengthsWrap}>
              {result.strengths.map((str, i) => (
                <span key={i} style={s.strengthChip}>{str}</span>
              ))}
            </div>
          </div>

          {/* Immediate actions */}
          <div style={s.card}>
            <p style={s.sectionTitle}>Immediate Actions</p>
            {result.immediateActions.map((action, i) => (
              <div key={i} style={s.actionRow}>
                <span style={s.actionNum}>{i + 1}</span>
                <span style={s.actionText}>{action}</span>
              </div>
            ))}
          </div>

          {/* Roadmap */}
          <div style={s.card}>
            <p style={s.sectionTitle}>Your Learning Roadmap</p>
            <p style={s.roadmapSub}>
              Click each week to expand the full plan
            </p>

            {result.roadmap.map((week, i) => (
              <div key={i} style={s.weekCard}
                onClick={() => setExpandedWeek(expandedWeek === i ? null : i)}>

                <div style={s.weekHeader}>
                  <div>
                    <span style={s.weekLabel}>{week.week}</span>
                    <span style={s.weekFocus}>{week.focus}</span>
                  </div>
                  <span style={s.weekArrow}>
                    {expandedWeek === i ? "▲" : "▼"}
                  </span>
                </div>

                {expandedWeek === i && (
                  <div style={s.weekBody}>

                    {/* Goal */}
                    <div style={s.weekSection}>
                      <p style={s.weekSectionLabel}>Goal</p>
                      <p style={s.weekSectionText}>{week.goal}</p>
                    </div>

                    {/* Resources */}
                    <div style={s.weekSection}>
                      <p style={s.weekSectionLabel}>Resources</p>
                      {week.resources.map((res, j) => (
                        <div key={j} style={s.resourceRow}>
                          <span style={{
                            ...s.resourceType,
                            background:
                              res.type === "video"  ? "#1e3a5f" :
                              res.type === "course" ? "#14532d" :
                              res.type === "docs"   ? "#3b1f5e" : "#2a2a3e"
                          }}>
                            {res.type}
                          </span>
                          {res.url ? (
                            <a href={res.url} target="_blank"
                              rel="noreferrer" style={s.resourceLink}
                              onClick={(e) => e.stopPropagation()}>
                              {res.title}
                            </a>
                          ) : (
                            <span style={s.resourceTitle}>{res.title}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Project */}
                    <div style={{
                      ...s.weekSection,
                      borderLeft: "3px solid #a78bfa",
                      paddingLeft: "12px"
                    }}>
                      <p style={s.weekSectionLabel}>Build this week</p>
                      <p style={s.weekSectionText}>{week.project}</p>
                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Analyse another */}
          <button
            onClick={() => { setResult(null); setResume(null);
              setJobDescription(""); }}
            style={{ ...s.btn, maxWidth: "900px", margin: "0 auto",
              display: "block" }}
          >
            Analyse Another Job
          </button>

        </div>
      )}
    </div>
  );
};

const s = {
  page:          { minHeight:"100vh", background:"#0f0f1a", padding:"32px 24px" },
  header:        { textAlign:"center", marginBottom:"32px",
                   maxWidth:"700px", margin:"0 auto 32px" },
  title:         { color:"#a78bfa", fontSize:"28px",
                   fontWeight:"700", marginBottom:"8px" },
  sub:           { color:"#888", fontSize:"14px", lineHeight:"1.6" },

  card:          { background:"#1e1e2e", borderRadius:"12px",
                   padding:"28px", maxWidth:"900px",
                   margin:"0 auto 24px" },

  uploadBox:     { border:"2px dashed #3a3a5e", borderRadius:"10px",
                   padding:"40px 20px", textAlign:"center",
                   cursor:"pointer", marginBottom:"24px",
                   transition:"border-color .2s" },
  uploadIcon:    { fontSize:"40px", marginBottom:"12px" },
  uploadTitle:   { color:"#fff", fontSize:"15px",
                   fontWeight:"500", marginBottom:"6px" },
  uploadSub:     { color:"#666", fontSize:"12px" },

  label:         { color:"#aaa", fontSize:"13px",
                   display:"block", marginBottom:"8px" },
  textarea:      { width:"100%", padding:"14px", background:"#12122a",
                   border:"1px solid #3a3a5e", borderRadius:"8px",
                   color:"#fff", fontSize:"14px", lineHeight:"1.6",
                   resize:"vertical", boxSizing:"border-box",
                   fontFamily:"inherit" },
  charCount:     { color:"#555", fontSize:"11px",
                   textAlign:"right", marginTop:"4px" },
  error:         { color:"#f87171", fontSize:"13px", marginBottom:"12px" },
  btn:           { width:"100%", padding:"14px", background:"#a78bfa",
                   border:"none", borderRadius:"8px", color:"#fff",
                   fontSize:"15px", fontWeight:"600", cursor:"pointer",
                   marginTop:"16px" },
  hint:          { color:"#666", fontSize:"12px",
                   textAlign:"center", marginTop:"12px" },

  resultsWrap:   { maxWidth:"900px", margin:"0 auto" },

  matchCard:     { background:"#1e1e2e", borderRadius:"12px",
                   padding:"28px", marginBottom:"24px",
                   display:"flex", gap:"32px", alignItems:"center" },
  matchLeft:     { textAlign:"center", flexShrink:0 },
  matchLabel:    { color:"#888", fontSize:"12px",
                   textTransform:"uppercase", letterSpacing:".05em",
                   marginBottom:"8px" },
  matchScore:    { fontSize:"56px", fontWeight:"700", lineHeight:1 },
  matchRight:    { flex:1 },
  summaryText:   { color:"#ccc", fontSize:"15px", lineHeight:"1.7" },

  row:           { display:"flex", gap:"24px", marginBottom:"24px" },
  skillCard:     { flex:1, background:"#1e1e2e",
                   borderRadius:"12px", padding:"24px" },
  sectionTitle:  { color:"#fff", fontSize:"14px", fontWeight:"600",
                   marginBottom:"16px" },
  roadmapSub:    { color:"#666", fontSize:"12px", marginBottom:"16px" },

  skillRow:      { display:"flex", justifyContent:"space-between",
                   alignItems:"center", padding:"8px 0",
                   borderBottom:"1px solid #2a2a3e" },
  skillName:     { color:"#ccc", fontSize:"13px" },
  skillBadge:    { fontSize:"11px", padding:"2px 8px",
                   borderRadius:"10px", color:"#aaa" },

  missingRow:    { padding:"10px 0", borderBottom:"1px solid #2a2a3e" },
  missingTop:    { display:"flex", justifyContent:"space-between",
                   alignItems:"center", marginBottom:"4px" },
  missingReason: { color:"#666", fontSize:"12px", margin:0 },

  strengthsWrap: { display:"flex", flexWrap:"wrap", gap:"8px" },
  strengthChip:  { background:"#12122a", border:"1px solid #2a2a5e",
                   color:"#a78bfa", padding:"6px 14px",
                   borderRadius:"20px", fontSize:"13px" },

  actionRow:     { display:"flex", gap:"12px", alignItems:"flex-start",
                   marginBottom:"12px" },
  actionNum:     { width:"24px", height:"24px", borderRadius:"50%",
                   background:"#a78bfa", color:"#fff", fontSize:"12px",
                   display:"flex", alignItems:"center",
                   justifyContent:"center", flexShrink:0,
                   fontWeight:"600" },
  actionText:    { color:"#ccc", fontSize:"14px", lineHeight:"1.6" },

  weekCard:      { background:"#12122a", borderRadius:"8px",
                   padding:"16px", marginBottom:"8px",
                   cursor:"pointer", border:"1px solid #2a2a5e" },
  weekHeader:    { display:"flex", justifyContent:"space-between",
                   alignItems:"center" },
  weekLabel:     { color:"#a78bfa", fontSize:"12px", fontWeight:"600",
                   marginRight:"12px" },
  weekFocus:     { color:"#fff", fontSize:"14px" },
  weekArrow:     { color:"#666", fontSize:"12px" },

  weekBody:      { marginTop:"16px", paddingTop:"16px",
                   borderTop:"1px solid #2a2a5e" },
  weekSection:   { marginBottom:"16px" },
  weekSectionLabel:{ color:"#888", fontSize:"11px", fontWeight:"600",
                   textTransform:"uppercase", letterSpacing:".05em",
                   marginBottom:"8px" },
  weekSectionText: { color:"#ccc", fontSize:"13px",
                   lineHeight:"1.6", margin:0 },

  resourceRow:   { display:"flex", gap:"10px", alignItems:"center",
                   marginBottom:"8px" },
  resourceType:  { fontSize:"10px", padding:"2px 8px",
                   borderRadius:"10px", color:"#aaa", flexShrink:0 },
  resourceLink:  { color:"#a78bfa", fontSize:"13px",
                   textDecoration:"none" },
  resourceTitle: { color:"#ccc", fontSize:"13px" },
};

export default SkillGap;