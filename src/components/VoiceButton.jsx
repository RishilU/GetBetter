import { useEffect, useRef, useState } from "react";
import { getSpeechRecognition, isSpeechSupported } from "../lib/speech";
import { COLORS } from "../lib/theme";

// Removes the friction of typing: talk, and it appends the transcript to
// whatever's already in the composer. Browser-native, no backend involved.
export default function VoiceButton({ onTranscript }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!isSpeechSupported()) return;
    const Impl = getSpeechRecognition();
    const recognition = new Impl();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (e) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) text += e.results[i][0].transcript;
      }
      if (text.trim()) onTranscript(text.trim());
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    return () => recognition.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isSpeechSupported()) return null;

  const toggle = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  return (
    <button
      onClick={toggle}
      title={listening ? "Stop recording" : "Talk instead of typing"}
      style={{
        background: listening ? COLORS.danger : COLORS.bgElevatedHover,
        border: `1px solid ${listening ? COLORS.danger : COLORS.border}`,
        borderRadius: 8,
        width: 30,
        height: 30,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 13,
        color: listening ? COLORS.onAccent : COLORS.textSecondary,
        animation: listening ? "flicker 1.2s ease-in-out infinite" : "none",
      }}
    >
      {listening ? "⏹" : "🎙️"}
    </button>
  );
}
