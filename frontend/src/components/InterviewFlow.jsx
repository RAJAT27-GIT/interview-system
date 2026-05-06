import { useState, useEffect, useRef } from "react";

const API = "http://localhost:8000";

export default function InterviewFlow({ question, userName, onComplete }) {
  const [ttsUrl, setTtsUrl] = useState(null);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (!question?.text) return;

    const fetchTTS = async () => {
      setTtsLoading(true);
      try {
        const res = await fetch(`${API}/tts?text=${encodeURIComponent(question.text)}&t=${Date.now()}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setTtsUrl(url);
      } catch (err) {
        console.error("Error fetching TTS:", err);
      } finally {
        setTtsLoading(false);
      }
    };

    fetchTTS();

    return () => {
      if (ttsUrl) URL.revokeObjectURL(ttsUrl);
    };
  }, [question?.text]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setTranscript("");
      setAudioBlob(null);
    } catch (err) {
      alert("Microphone access denied! Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const submitAnswer = async () => {
    if (!audioBlob) {
      alert("Please record your answer first!");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("user_name", userName);
      formData.append("model_answer_data", JSON.stringify({
        model_answer: question.model_answer || "",
        keywords: question.keywords || [],
      }));
      formData.append("user_audio", new File([audioBlob], "answer.webm", { type: "audio/webm" }));

      const res = await fetch(`${API}/interview`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (onComplete) onComplete(data);
    } catch (err) {
      console.error("Error submitting interview:", err);
      alert("Error submitting answer. Make sure the backend server is running.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitTextAnswer = async () => {
    if (!transcript.trim()) {
      alert("Please type your answer!");
      return;
    }

    setSubmitting(true);

    try {
      const evalRes = await fetch(`${API}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_answer: transcript,
          model_answer: {
            model_answer: question.model_answer || "",
            keywords: question.keywords || [],
          },
        }),
      });
      const evaluation = await evalRes.json();

      const fbRes = await fetch(`${API}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ final_score: evaluation.final_score }),
      });
      const fbData = await fbRes.json();

      await fetch(`${API}/add_score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: userName, score: evaluation.final_score }),
      });

      if (onComplete) {
        onComplete({
          user_transcript: transcript,
          evaluation,
          feedback: fbData.feedback,
        });
      }
    } catch (err) {
      console.error("Error submitting text answer:", err);
      alert("Error submitting. Make sure backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Question Display */}
      <div className="mb-4 p-4 rounded" style={{ background: "#e0f2fe", border: "1px solid #bae6fd" }}>
        <p className="text-secondary mb-1 small fw-bold" style={{ color: "#0369a1" }}>QUESTION</p>
        <h4 className="fw-bold mb-0" style={{ color: "#0f172a" }}>{question?.text}</h4>
        <div className="mt-3">
          {question?.tags?.map((tag, i) => (
            <span key={i} className="badge bg-white text-primary border border-primary me-2 shadow-sm">{tag}</span>
          ))}
        </div>
      </div>

      {/* TTS Audio Player */}
      {ttsLoading && <p className="text-primary mb-3 fw-medium">🔊 Loading audio...</p>}
      {ttsUrl && (
        <div className="mb-4">
          <p className="text-secondary small fw-medium mb-1">🔊 Listen to the question:</p>
          <audio key={ttsUrl} controls autoPlay src={ttsUrl} className="w-100 shadow-sm" style={{ borderRadius: "10px", height: "45px" }} />
        </div>
      )}

      <hr style={{ borderColor: "#e2e8f0" }} />

      {/* Recording Section */}
      <div className="mb-4">
        <h5 className="mb-3 fw-bold" style={{ color: "#1e293b" }}>🎤 Record Your Answer</h5>
        <div className="d-flex gap-3 flex-wrap">
          <button
            onClick={startRecording}
            disabled={recording || submitting}
            className={`btn btn-lg fw-bold shadow-sm ${recording ? "btn-secondary" : "btn-danger"}`}
            style={{ borderRadius: "12px", padding: "12px 24px" }}
          >
            {recording ? "⏺️ Recording..." : "🎤 Start Recording"}
          </button>
          <button
            onClick={stopRecording}
            disabled={!recording}
            className="btn btn-lg btn-warning fw-bold shadow-sm"
            style={{ borderRadius: "12px", padding: "12px 24px" }}
          >
            ⏹️ Stop
          </button>
        </div>

        {recording && (
          <div className="mt-3 d-flex align-items-center gap-2">
            <div className="recording-pulse" />
            <span className="text-danger fw-bold">Recording in progress...</span>
          </div>
        )}

        {audioBlob && !recording && (
          <div className="mt-3 p-3 bg-light rounded border border-light">
            <p className="text-success fw-bold">✅ Recording captured! Click "Submit Answer" below.</p>
            <audio controls src={URL.createObjectURL(audioBlob)} className="w-100 shadow-sm" style={{ borderRadius: "10px", height: "45px" }} />
          </div>
        )}
      </div>

      <hr style={{ borderColor: "#e2e8f0" }} />

      {/* Text Answer Fallback */}
      <div className="mb-4">
        <h5 className="mb-2 fw-bold" style={{ color: "#1e293b" }}>⌨️ Or Type Your Answer</h5>
        <textarea
          className="form-control form-control-lg shadow-sm"
          rows={4}
          placeholder="Type your answer here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          disabled={submitting}
        />
      </div>

      {/* Submit */}
      <div className="d-flex gap-3 flex-wrap mt-4">
        {audioBlob && (
          <button
            onClick={submitAnswer}
            disabled={submitting}
            className="btn btn-lg btn-success px-4 fw-bold shadow-sm"
            style={{ borderRadius: "12px" }}
          >
            {submitting ? "⏳ Evaluating..." : "🚀 Submit Voice Answer"}
          </button>
        )}
        <button
          onClick={submitTextAnswer}
          disabled={submitting || !transcript.trim()}
          className="btn btn-lg btn-outline-primary px-4 fw-bold shadow-sm bg-white"
          style={{ borderRadius: "12px" }}
        >
          {submitting ? "⏳ Evaluating..." : "📝 Submit Text Answer"}
        </button>
      </div>

      {/* Recording Pulse CSS */}
      <style>{`
        .recording-pulse {
          width: 14px;
          height: 14px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
