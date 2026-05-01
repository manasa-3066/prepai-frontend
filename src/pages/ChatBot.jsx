import { useState, useRef, useEffect } from "react";
import api from "../api/axios";

const ChatBot = () => {
  const [file, setFile]           = useState(null);
  const [uploaded, setUploaded]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages]   = useState([]);
  const [question, setQuestion]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [docInfo, setDocInfo]     = useState(null);
  const bottomRef                 = useRef(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("document", file);

      const res = await api.post("/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDocInfo(res.data.data);
      setUploaded(true);

      // Add welcome message
      setMessages([{
        role: "assistant",
        text: `Document uploaded successfully! It was split into ${res.data.data.chunks} chunks and indexed. You can now ask me anything about this document.`,
      }]);

    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = question.trim();
    setQuestion("");
    setLoading(true);

    // Add user message immediately
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);

    try {
      const res = await api.post("/chat/ask", { question: userMessage });

      // Add AI response
      setMessages(prev => [...prev, {
        role:    "assistant",
        text:    res.data.data.answer,
        sources: res.data.data.sources,
      }]);

    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Sorry, something went wrong. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await api.delete("/chat/clear");
      setUploaded(false);
      setFile(null);
      setMessages([]);
      setDocInfo(null);
    } catch (err) {
      console.error("Clear failed");
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleAsk();
    }
  };

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <h1 style={s.title}>Study Assistant</h1>
        <p style={s.sub}>
          Upload your notes, textbook, or any PDF — then ask questions about it
        </p>
      </div>

      {/* Upload section — shown before upload */}
      {!uploaded && (
        <div style={s.uploadCard}>

          <div
            style={{
              ...s.dropZone,
              borderColor: file ? "#a78bfa" : "#3a3a5e"
            }}
            onClick={() => document.getElementById("pdfInput").click()}
          >
            <input
              id="pdfInput"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <span style={s.dropIcon}>📚</span>
            <p style={s.dropTitle}>
              {file ? file.name : "Click to upload your PDF"}
            </p>
            <p style={s.dropSub}>
              {file
                ? `${(file.size / 1024).toFixed(1)} KB · Ready to upload`
                : "Lecture notes · Textbooks · Study guides · PDF only"}
            </p>
          </div>

          {error && <p style={s.error}>{error}</p>}

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            style={{
              ...s.btn,
              opacity: uploading || !file ? 0.6 : 1
            }}
          >
            {uploading ? "Processing document..." : "Upload & Index Document"}
          </button>

          {uploading && (
            <div style={s.processingBox}>
              <p style={s.processingText}>
                Extracting text from PDF...
              </p>
              <p style={s.processingText}>
                Creating embeddings for each chunk...
              </p>
              <p style={s.processingText}>
                This takes 30-60 seconds for the first upload.
              </p>
            </div>
          )}

        </div>
      )}

      {/* Chat section — shown after upload */}
      {uploaded && (
        <div style={s.chatWrap}>

          {/* Document info bar */}
          <div style={s.docBar}>
            <div style={s.docInfo}>
              <span style={s.docIcon}>📄</span>
              <span style={s.docName}>{file?.name}</span>
              <span style={s.docChunks}>
                {docInfo?.chunks} chunks indexed
              </span>
            </div>
            <button onClick={handleClear} style={s.clearBtn}>
              Upload Different Document
            </button>
          </div>

          {/* Messages */}
          <div style={s.messagesBox}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                ...s.messageRow,
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  ...s.bubble,
                  background:   msg.role === "user" ? "#a78bfa" : "#1e1e2e",
                  color:        msg.role === "user" ? "#fff" : "#e2e8f0",
                  borderRadius: msg.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                }}>
                  <p style={s.bubbleText}>{msg.text}</p>

                  {/* Sources — shown under AI messages */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div style={s.sourcesWrap}>
                      <p style={s.sourcesLabel}>Sources from document:</p>
                      {msg.sources.map((src, j) => (
                        <div key={j} style={s.sourceChip}>
                          <span style={s.sourceSimilarity}>
                            {src.similarity}% match
                          </span>
                          <span style={s.sourceText}>{src.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div style={{ ...s.messageRow, justifyContent: "flex-start" }}>
                <div style={{
                  ...s.bubble,
                  background: "#1e1e2e",
                  borderRadius: "18px 18px 18px 4px"
                }}>
                  <p style={{ ...s.bubbleText, color: "#666" }}>
                    Thinking...
                  </p>
                </div>
              </div>
            )}

            {/* Auto scroll target */}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={s.inputRow}>
            <textarea
              style={s.inputBox}
              placeholder="Ask anything about your document... (Enter to send, Shift+Enter for new line)"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              disabled={loading}
            />
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              style={{
                ...s.sendBtn,
                opacity: loading || !question.trim() ? 0.5 : 1
              }}
            >
              Send
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

const s = {
  page:           { minHeight:"100vh", background:"#0f0f1a", padding:"32px 24px" },
  header:         { textAlign:"center", marginBottom:"32px",
                    maxWidth:"700px", margin:"0 auto 32px" },
  title:          { color:"#a78bfa", fontSize:"28px",
                    fontWeight:"700", marginBottom:"8px" },
  sub:            { color:"#888", fontSize:"14px", lineHeight:"1.6" },

  uploadCard:     { background:"#1e1e2e", borderRadius:"12px",
                    padding:"36px", maxWidth:"600px", margin:"0 auto" },
  dropZone:       { border:"2px dashed", borderRadius:"10px",
                    padding:"48px 24px", textAlign:"center",
                    cursor:"pointer", marginBottom:"24px",
                    transition:"border-color .2s" },
  dropIcon:       { fontSize:"48px", display:"block", marginBottom:"16px" },
  dropTitle:      { color:"#fff", fontSize:"16px",
                    fontWeight:"500", marginBottom:"8px" },
  dropSub:        { color:"#666", fontSize:"13px" },
  error:          { color:"#f87171", fontSize:"13px", marginBottom:"12px" },
  btn:            { width:"100%", padding:"14px", background:"#a78bfa",
                    border:"none", borderRadius:"8px", color:"#fff",
                    fontSize:"15px", fontWeight:"600", cursor:"pointer" },
  processingBox:  { marginTop:"16px", padding:"16px",
                    background:"#12122a", borderRadius:"8px" },
  processingText: { color:"#666", fontSize:"12px",
                    marginBottom:"4px", lineHeight:"1.8" },

  chatWrap:       { maxWidth:"860px", margin:"0 auto",
                    display:"flex", flexDirection:"column", height:"80vh" },
  docBar:         { background:"#1e1e2e", borderRadius:"10px",
                    padding:"12px 20px", marginBottom:"16px",
                    display:"flex", justifyContent:"space-between",
                    alignItems:"center" },
  docInfo:        { display:"flex", alignItems:"center", gap:"10px" },
  docIcon:        { fontSize:"18px" },
  docName:        { color:"#fff", fontSize:"13px", fontWeight:"500" },
  docChunks:      { color:"#666", fontSize:"12px",
                    background:"#2a2a3e", padding:"2px 8px",
                    borderRadius:"10px" },
  clearBtn:       { background:"transparent", border:"1px solid #3a3a5e",
                    color:"#888", padding:"6px 14px", borderRadius:"6px",
                    cursor:"pointer", fontSize:"12px" },

  messagesBox:    { flex:1, overflowY:"auto", padding:"8px 0",
                    marginBottom:"16px" },
  messageRow:     { display:"flex", marginBottom:"16px" },
  bubble:         { maxWidth:"75%", padding:"14px 18px" },
  bubbleText:     { fontSize:"14px", lineHeight:"1.7", margin:0 },

  sourcesWrap:    { marginTop:"12px", paddingTop:"12px",
                    borderTop:"1px solid #2a2a5e" },
  sourcesLabel:   { color:"#666", fontSize:"11px",
                    marginBottom:"8px", textTransform:"uppercase",
                    letterSpacing:".05em" },
  sourceChip:     { background:"#12122a", borderRadius:"6px",
                    padding:"8px", marginBottom:"6px" },
  sourceSimilarity:{ color:"#a78bfa", fontSize:"11px",
                    fontWeight:"600", display:"block", marginBottom:"4px" },
  sourceText:     { color:"#666", fontSize:"11px", lineHeight:"1.5" },

  inputRow:       { display:"flex", gap:"12px", alignItems:"flex-end" },
  inputBox:       { flex:1, padding:"12px 16px", background:"#1e1e2e",
                    border:"1px solid #3a3a5e", borderRadius:"10px",
                    color:"#fff", fontSize:"14px", lineHeight:"1.5",
                    resize:"none", fontFamily:"inherit" },
  sendBtn:        { padding:"12px 24px", background:"#a78bfa",
                    border:"none", borderRadius:"10px", color:"#fff",
                    fontSize:"14px", fontWeight:"600", cursor:"pointer",
                    flexShrink:0 },
};

export default ChatBot;