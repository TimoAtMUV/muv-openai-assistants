"use client";

import React, { useState, useRef } from "react";
import styles from "./page.module.css";
import HomeButton from "../../components/home-button";

const VoiceGeneration = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState<"alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer">("alloy");
  const [model, setModel] = useState<"tts-1" | "tts-1-hd">("tts-1");
  const [speed, setSpeed] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Bitte geben Sie einen Text ein");
      return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);

    // Clean up previous audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          voice: voice,
          model: model,
          speed: speed,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Sprache konnte nicht generiert werden");
      }

      // Create a blob URL from the audio response
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err: any) {
      setError(err.message || "Beim Generieren der Sprache ist ein Fehler aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    fetch(audioUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `speech-${voice}-${Date.now()}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  // Auto-play audio when URL is set
  React.useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.load(); // Reload the audio element
      audioRef.current.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
    }
  }, [audioUrl]);

  // Clean up audio URL on unmount
  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <main className={styles.main}>
      <HomeButton />
      <div className={styles.container}>
        <h1 className={styles.title}>Sprachgenerierung mit TTS</h1>
        
        <div className={styles.controls}>
          <div className={styles.inputGroup}>
            <label htmlFor="text">Zu konvertierender Text</label>
            <textarea
              id="text"
              className={styles.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Geben Sie den Text ein, den Sie in Sprache umwandeln möchten..."
              rows={6}
            />
            <div className={styles.charCount}>
              {text.length} Zeichen
            </div>
          </div>

          <div className={styles.options}>
            <div className={styles.inputGroup}>
              <label htmlFor="voice">Stimme</label>
              <select
                id="voice"
                className={styles.select}
                value={voice}
                onChange={(e) => setVoice(e.target.value as typeof voice)}
              >
                <option value="alloy">Alloy</option>
                <option value="echo">Echo</option>
                <option value="fable">Fable</option>
                <option value="onyx">Onyx</option>
                <option value="nova">Nova</option>
                <option value="shimmer">Shimmer</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="model">Modell</label>
              <select
                id="model"
                className={styles.select}
                value={model}
                onChange={(e) => setModel(e.target.value as typeof model)}
              >
                <option value="tts-1">TTS-1 (Schneller)</option>
                <option value="tts-1-hd">TTS-1-HD (Höhere Qualität)</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="speed">
                Geschwindigkeit: {speed.toFixed(2)}x
              </label>
              <input
                id="speed"
                type="range"
                min="0.25"
                max="4.0"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.speedLabels}>
                <span>0.25x</span>
                <span>4.0x</span>
              </div>
            </div>
          </div>

          <button
            className={styles.button}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Wird generiert..." : "Sprache generieren"}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {audioUrl && (
          <div className={styles.audioContainer}>
            <div className={styles.audioPlayer}>
              <audio ref={audioRef} src={audioUrl} controls className={styles.audio}>
                Ihr Browser unterstützt das Audio-Element nicht.
              </audio>
            </div>
            <button
              className={styles.downloadButton}
              onClick={handleDownload}
            >
              Audio herunterladen
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default VoiceGeneration;

