export function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  const Impl = window.SpeechRecognition || window.webkitSpeechRecognition;
  return Impl || null;
}

export function isSpeechSupported() {
  return getSpeechRecognition() !== null;
}
