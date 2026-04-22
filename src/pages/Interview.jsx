import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

const COMPANIES = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple",
  "TCS", "Infosys", "Wipro", "Accenture", "Flipkart",
  "Swiggy", "Zomato", "Razorpay", "CRED", "Startup"
];

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Analyst", "Data Scientist", "DevOps Engineer",
  "System Design Engineer", "Software Engineer"
];

const DIFFICULTIES = ["easy", "medium", "hard"];

// ─── Phase 1 — Setup ──────────────────────────────────────────────────────────
const Setup = ({ onStart }) => {
  const [form, setForm]       = useState({ company: "", role: "", difficulty: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleStart = async () => {
    if (!form.company || !form.role || !form.difficulty) {
      setError("Please select all three fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/interview/start", form);
      onStart(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.setupCard}>
        <h1 style={s.title}>Mock Interview</h1>
        <p style={s.sub}>
          5 questions · AI feedback on every answer · Final score out of 50
        </p>

        <label style={s.label}>Company</label>
        <select name="company" value={form.company}
          onChange={handleChange} style={s.select}>
          <option value="">Select company</option>
          {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={s.label}>Role</label>
        <select name="role" value={form.role}
          onChange={handleChange} style={s.select}>
          <option value="">Select role</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <label style={s.label}>Difficulty</label>
        <select name="difficulty" value={form.difficulty}
          onChange={handleChange} style={s.select}>
          <option value="">Select difficulty</option>
          {DIFFICULTIES.map(d => (
            <option key={d} value={d}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>

        {error && <p style={s.error}>{error}</p>}

        <button onClick={handleStart} disabled={loading} style={s.btn}>
          {loading ? "Preparing your interview..." : "Start Interview"}
        </button>

        {loading && (
          <p style={s.hint}>Generating 5 questions tailored to {form.company}...</p>
        )}
      </div>
    </div>
  );
};

// ─── Phase 2+3 — Question + Feedback ─────────────────────────────────────────
const QuestionScreen = ({ session, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer]     = useState("");
  const [feedback, setFeedback]         = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [isListening, setIsListening]   = useState(false);
  const recognitionRef                  = useRef(null);

  const totalQuestions  = session.questions.length;
  const currentQuestion = session.questions[currentIndex];

  // ── Auto-speak question when it changes ──
  useEffect(() => {
    speakQuestion(currentQuestion.question);
    return () => window.speechSynthesis.cancel();
  }, [currentIndex]);

  // ── Text to speech ──
  const speakQuestion = (text) => {
    window.speechSynthesis.cancel();
    const utterance   = new SpeechSynthesisUtterance(text);
    utterance.lang    = "en-US";
    utterance.rate    = 0.9;
    utterance.pitch   = 1;
    window.speechSynthesis.speak(utterance);
  };

  // ── Voice input setup ──
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition         = new SpeechRecognition();
      recognition.continuous    = true;
      recognition.interimResults = true;
      recognition.lang          = "en-US";
      recognition.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map(r => r[0].transcript)
          .join("");
        setUserAnswer(transcript);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice not supported in this browser. Try Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setUserAnswer("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // ── Submit answer ──
  const handleSubmit = async () => {
    if (!userAnswer.trim()) {
      setError("Please type or speak your answer");
      return;
    }
    setError("");
    setLoading(true);
    window.speechSynthesis.cancel();
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    try {
      const res = await api.post("/interview/evaluate", {
        sessionId:     session.sessionId,
        questionIndex: currentIndex,
        userAnswer,
      });
      setFeedback(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Next question or complete ──
  const handleNext = async () => {
    window.speechSynthesis.cancel();
    if (currentIndex + 1 >= totalQuestions) {
      setLoading(true);
      try {
        const res = await api.post("/interview/complete", {
          sessionId: session.sessionId,
        });
        onComplete(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setFeedback(null);
      setError("");
    }
  };

  const scoreColor = (score) => {
    if (score >= 8) return "#4ade80";
    if (score >= 5) return "#facc15";
    return "#f87171";
  };

  return (
    <div style={s.page}>

      {/* Progress bar */}
      <div style={s.progressWrap}>
        <div style={s.progressInfo}>
          <span style={s.progressText}>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span style={s.progressText}>
            {session.company} · {session.role}
          </span>
        </div>
        <div style={s.progressBar}>
          <div style={{
            ...s.progressFill,
            width: `${((currentIndex + (feedback ? 1 : 0)) / totalQuestions) * 100}%`
          }}/>
        </div>
      </div>

      <div style={s.card}>

        {/* Topic badge */}
        <span style={s.badge}>{currentQuestion.topic}</span>

        {/* Question box */}
        <div style={s.questionBox}>
          <p style={s.questionLabel}>Question {currentIndex + 1}</p>
          <p style={s.questionText}>{currentQuestion.question}</p>
        </div>

        {/* Read aloud button */}
        {!feedback && (
          <button
            onClick={() => speakQuestion(currentQuestion.question)}
            style={s.speakBtn}
          >
            Read Question Aloud
          </button>
        )}

        {/* Answer input */}
        {!feedback && (
          <>
            <textarea
              style={{
                ...s.textarea,
                borderColor: isListening ? "#a78bfa" : "#3a3a5e"
              }}
              placeholder={
                isListening
                  ? "Listening... speak your answer"
                  : "Type your answer here..."
              }
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              rows={6}
            />

            <div style={s.row}>
              <button
                onClick={toggleVoice}
                style={{
                  ...s.voiceBtn,
                  background: isListening ? "#a78bfa" : "#2a2a3e",
                  color:      isListening ? "#fff"    : "#a78bfa",
                }}
              >
                {isListening ? "Stop Voice" : "Use Voice"}
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{ ...s.btn, flex: 1, marginTop: 0 }}
              >
                {loading ? "Evaluating..." : "Submit Answer"}
              </button>
            </div>

            {error && <p style={s.error}>{error}</p>}
          </>
        )}

        {/* Feedback */}
        {feedback && (
          <div style={s.feedbackWrap}>

            <div style={s.scoreRow}>
              <span style={s.scoreLabel}>Your score</span>
              <span style={{ ...s.scoreValue, color: scoreColor(feedback.score) }}>
                {feedback.score} / 10
              </span>
            </div>

            <div style={s.feedbackBox}>
              <p style={s.feedbackLabel}>Feedback</p>
              <p style={s.feedbackText}>{feedback.feedback}</p>
            </div>

            <div style={{ ...s.feedbackBox, borderLeft: "3px solid #4ade80" }}>
              <p style={{ ...s.feedbackLabel, color: "#4ade80" }}>What you did well</p>
              <p style={s.feedbackText}>{feedback.strengths}</p>
            </div>

            <div style={{ ...s.feedbackBox, borderLeft: "3px solid #f87171" }}>
              <p style={{ ...s.feedbackLabel, color: "#f87171" }}>What was missing</p>
              <p style={s.feedbackText}>{feedback.improvements}</p>
            </div>

            <div style={{ ...s.feedbackBox, borderLeft: "3px solid #a78bfa" }}>
              <p style={{ ...s.feedbackLabel, color: "#a78bfa" }}>Sample answer</p>
              <p style={s.feedbackText}>{feedback.sampleAnswer}</p>
            </div>

            <button onClick={handleNext} disabled={loading} style={s.btn}>
              {loading
                ? "Loading..."
                : currentIndex + 1 >= totalQuestions
                ? "See Final Results"
                : `Next Question (${currentIndex + 2}/${totalQuestions})`}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

// ─── Phase 4 — Results ────────────────────────────────────────────────────────
const Results = ({ result, onRestart }) => {
  const [expanded, setExpanded] = useState(null);

  const scoreColor = (pct) => {
    if (pct >= 80) return "#4ade80";
    if (pct >= 50) return "#facc15";
    return "#f87171";
  };

  return (
    <div style={s.page}>
      <div style={s.card}>

        <div style={s.scoreCircle}>
          <span style={{ ...s.scoreBig, color: scoreColor(result.percentage) }}>
            {result.totalScore}
          </span>
          <span style={s.scoreMax}>/ {result.maxScore}</span>
          <span style={{ ...s.scorePct, color: scoreColor(result.percentage) }}>
            {result.percentage}%
          </span>
        </div>

        <div style={s.feedbackBox}>
          <p style={s.feedbackLabel}>Overall feedback</p>
          <p style={s.feedbackText}>{result.overallFeedback}</p>
        </div>

        <div style={s.row}>
          <div style={{ ...s.areaBox, borderColor: "#4ade80" }}>
            <p style={{ ...s.areaLabel, color: "#4ade80" }}>Strongest area</p>
            <p style={s.areaText}>{result.strongestArea}</p>
          </div>
          <div style={{ ...s.areaBox, borderColor: "#f87171" }}>
            <p style={{ ...s.areaLabel, color: "#f87171" }}>Needs work</p>
            <p style={s.areaText}>{result.weakestArea}</p>
          </div>
        </div>

        <div style={{ ...s.feedbackBox, borderLeft: "3px solid #a78bfa",
          marginTop: "12px" }}>
          <p style={{ ...s.feedbackLabel, color: "#a78bfa" }}>What to do next</p>
          <p style={s.feedbackText}>{result.recommendation}</p>
        </div>

        <p style={{ ...s.feedbackLabel, margin: "20px 0 12px" }}>
          Question breakdown
        </p>

        {result.questions.map((q, i) => (
          <div key={i} style={s.qRow}
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <div style={s.qHeader}>
              <span style={s.qTopic}>Q{i + 1} · {q.topic}</span>
              <span style={{ ...s.qScore, color: scoreColor((q.score / 10) * 100) }}>
                {q.score}/10
              </span>
            </div>
            {expanded === i && (
              <div style={{ marginTop: "12px" }}>
                <p style={s.feedbackText}>{q.question}</p>
                <p style={{ ...s.feedbackLabel, marginTop: "10px" }}>Your answer</p>
                <p style={s.feedbackText}>{q.userAnswer}</p>
                <p style={{ ...s.feedbackLabel, marginTop: "10px",
                  color: "#4ade80" }}>Strengths</p>
                <p style={s.feedbackText}>{q.strengths}</p>
                <p style={{ ...s.feedbackLabel, marginTop: "10px",
                  color: "#f87171" }}>Improvements</p>
                <p style={s.feedbackText}>{q.improvements}</p>
              </div>
            )}
          </div>
        ))}

        <button onClick={onRestart} style={{ ...s.btn, marginTop: "24px" }}>
          Start New Interview
        </button>

      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const Interview = () => {
  const [phase, setPhase]     = useState("setup");
  const [session, setSession] = useState(null);
  const [result, setResult]   = useState(null);

  const handleStart    = (data) => { setSession(data); setPhase("interview"); };
  const handleComplete = (data) => { setResult(data);  setPhase("results"); };
  const handleRestart  = ()     => { setSession(null); setResult(null); setPhase("setup"); };

  if (phase === "setup")     return <Setup onStart={handleStart} />;
  if (phase === "interview") return <QuestionScreen session={session} onComplete={handleComplete} />;
  if (phase === "results")   return <Results result={result} onRestart={handleRestart} />;
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page:         { minHeight:"100vh", background:"#0f0f1a", padding:"32px 24px" },

  // setup card — centered, max 560px, feels focused
  setupCard:    { background:"#1e1e2e", borderRadius:"14px", padding:"48px",
                  maxWidth:"560px", margin:"40px auto" },

  // question/result card — wider, fills the screen better
  card:         { background:"#1e1e2e", borderRadius:"14px", padding:"36px",
                  maxWidth:"900px", margin:"0 auto" },

  title:        { color:"#a78bfa", fontSize:"28px", fontWeight:"700",
                  marginBottom:"8px", textAlign:"center" },
  sub:          { color:"#888", fontSize:"14px", textAlign:"center",
                  marginBottom:"32px" },
  label:        { color:"#aaa", fontSize:"13px", display:"block",
                  marginBottom:"6px", marginTop:"16px" },
  select:       { width:"100%", padding:"12px 14px", background:"#12122a",
                  border:"1px solid #3a3a5e", borderRadius:"8px",
                  color:"#fff", fontSize:"14px" },
  btn:          { width:"100%", padding:"14px", background:"#a78bfa",
                  border:"none", borderRadius:"8px", color:"#fff",
                  fontSize:"15px", fontWeight:"600", cursor:"pointer",
                  marginTop:"16px" },
  hint:         { color:"#666", fontSize:"12px", textAlign:"center",
                  marginTop:"12px" },
  error:        { color:"#f87171", fontSize:"13px", marginTop:"8px" },

  progressWrap: { maxWidth:"900px", margin:"0 auto 20px" },
  progressInfo: { display:"flex", justifyContent:"space-between",
                  marginBottom:"8px" },
  progressText: { color:"#888", fontSize:"12px" },
  progressBar:  { height:"6px", background:"#2a2a3e", borderRadius:"3px" },
  progressFill: { height:"100%", background:"#a78bfa",
                  borderRadius:"3px", transition:"width .5s" },

  badge:        { background:"#2a2a3e", color:"#a78bfa", fontSize:"12px",
                  padding:"4px 12px", borderRadius:"20px",
                  display:"inline-block", marginBottom:"16px" },

  questionBox:  { background:"#12122a", borderRadius:"10px",
                  padding:"24px", marginBottom:"12px",
                  border:"1px solid #2a2a5e" },
  questionLabel:{ color:"#a78bfa", fontSize:"11px", fontWeight:"600",
                  textTransform:"uppercase", letterSpacing:".08em",
                  marginBottom:"12px" },
  questionText: { color:"#e2e8f0", fontSize:"18px", lineHeight:"1.8", margin:0 },

  speakBtn:     { background:"transparent", border:"1px solid #3a3a5e",
                  color:"#888", padding:"8px 16px", borderRadius:"6px",
                  cursor:"pointer", fontSize:"12px", marginBottom:"16px" },

  textarea:     { width:"100%", padding:"14px", background:"#12122a",
                  border:"2px solid #3a3a5e", borderRadius:"8px",
                  color:"#fff", fontSize:"15px", lineHeight:"1.7",
                  resize:"vertical", boxSizing:"border-box",
                  fontFamily:"inherit", marginBottom:"12px",
                  minHeight:"160px" },
  row:          { display:"flex", gap:"12px", alignItems:"stretch" },
  voiceBtn:     { padding:"12px 24px", border:"1px solid #a78bfa",
                  borderRadius:"8px", cursor:"pointer",
                  fontSize:"13px", fontWeight:"500" },

  feedbackWrap: { marginTop:"8px" },
  scoreRow:     { display:"flex", justifyContent:"space-between",
                  alignItems:"center", marginBottom:"20px",
                  background:"#12122a", padding:"16px 20px",
                  borderRadius:"10px" },
  scoreLabel:   { color:"#888", fontSize:"15px" },
  scoreValue:   { fontSize:"32px", fontWeight:"700" },
  feedbackBox:  { background:"#12122a", borderRadius:"8px",
                  padding:"16px 18px", marginBottom:"12px",
                  borderLeft:"3px solid #3a3a5e" },
  feedbackLabel:{ color:"#888", fontSize:"11px", fontWeight:"600",
                  textTransform:"uppercase", letterSpacing:".05em",
                  marginBottom:"8px" },
  feedbackText: { color:"#ccc", fontSize:"14px", lineHeight:"1.8", margin:0 },

  scoreCircle:  { textAlign:"center", marginBottom:"28px", padding:"32px",
                  background:"#12122a", borderRadius:"12px" },
  scoreBig:     { fontSize:"72px", fontWeight:"700", display:"block" },
  scoreMax:     { color:"#888", fontSize:"22px" },
  scorePct:     { fontSize:"20px", fontWeight:"600",
                  display:"block", marginTop:"8px" },

  areaBox:      { flex:1, background:"#12122a", borderRadius:"8px",
                  padding:"16px", border:"1px solid", marginBottom:"0" },
  areaLabel:    { fontSize:"11px", fontWeight:"600",
                  textTransform:"uppercase", marginBottom:"8px" },
  areaText:     { color:"#ccc", fontSize:"14px", margin:0 },

  qRow:         { background:"#12122a", borderRadius:"8px",
                  padding:"16px", marginBottom:"8px",
                  cursor:"pointer", border:"1px solid #2a2a5e" },
  qHeader:      { display:"flex", justifyContent:"space-between",
                  alignItems:"center" },
  qTopic:       { color:"#ccc", fontSize:"14px" },
  qScore:       { fontSize:"18px", fontWeight:"700" },
};

export default Interview;