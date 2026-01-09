"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
import HomeButton from "../../components/home-button";

// TypeScript declarations for Speech Recognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

const SpeechToText = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionClass) {
        setIsSupported(true);
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "de-DE"; // German language

        recognition.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript((prev) => {
            const currentText = prev.trim();
            return currentText 
              ? `${currentText} ${finalTranscript}`.trim() 
              : finalTranscript.trim();
          });
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            setError("Mikrofon-Zugriff wurde verweigert. Bitte erlauben Sie den Zugriff in den Browsereinstellungen.");
          } else if (event.error === "no-speech") {
            setError("Keine Sprache erkannt. Bitte versuchen Sie es erneut.");
          } else if (event.error === "network") {
            setError("Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.");
          } else {
            setError(`Fehler: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
        setError("Spracherkennung wird in Ihrem Browser nicht unterstützt. Bitte verwenden Sie Chrome, Edge oder Safari.");
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      setError("Spracherkennung ist nicht verfügbar.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setError(null);
    } else {
      try {
        setError(null);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        setError("Fehler beim Starten der Spracherkennung.");
      }
    }
  };

  const handleClear = () => {
    setTranscript("");
    setError(null);
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript).then(() => {
        // Show temporary success message
        const originalError = error;
        setError("Text in Zwischenablage kopiert!");
        setTimeout(() => setError(originalError), 2000);
      }).catch(() => {
        setError("Fehler beim Kopieren des Textes.");
      });
    }
  };

  const handleSummarize = async () => {
    if (!transcript || transcript.trim().length === 0) {
      setError("Bitte transkribieren Sie zuerst einen Text.");
      return;
    }

    setIsSummarizing(true);
    setError(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: transcript }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Zusammenfassen");
      }

      setSummary(data.summary || "Keine Zusammenfassung verfügbar.");
    } catch (err: any) {
      console.error("Error summarizing:", err);
      setError(err.message || "Fehler beim Zusammenfassen des Textes.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <main className={styles.main}>
      <HomeButton />
      <div className={styles.container}>
        <h1 className={styles.title}>Sprache zu Text</h1>
        
        {!isSupported && (
          <div className={styles.warning}>
            <p>⚠️ Spracherkennung wird in Ihrem Browser nicht unterstützt.</p>
            <p>Bitte verwenden Sie Chrome, Edge oder Safari für die beste Erfahrung.</p>
          </div>
        )}

        <div className={styles.controls}>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.recordButton} ${isListening ? styles.recordButtonActive : ""}`}
              onClick={toggleSpeechRecognition}
              disabled={!isSupported}
            >
              {isListening ? (
                <>
                  <span className={styles.recordIcon}>🎤</span>
                  Aufnahme läuft...
                </>
              ) : (
                <>
                  <span className={styles.recordIcon}>🎤</span>
                  Aufnahme starten
                </>
              )}
            </button>
            
            <button
              className={styles.button}
              onClick={handleClear}
              disabled={!transcript}
            >
              Löschen
            </button>
            
            <button
              className={styles.button}
              onClick={handleCopy}
              disabled={!transcript}
            >
              Kopieren
            </button>
            
            <button
              className={`${styles.button} ${styles.summarizeButton}`}
              onClick={handleSummarize}
              disabled={!transcript || isSummarizing}
            >
              {isSummarizing ? "Zusammenfassen..." : "Zusammenfassen"}
            </button>
          </div>

          {error && (
            <div className={`${styles.error} ${error.includes("kopiert") ? styles.success : ""}`}>
              {error}
            </div>
          )}

          <div className={styles.transcriptContainer}>
            <label htmlFor="transcript" className={styles.label}>
              Transkription
            </label>
            <textarea
              id="transcript"
              className={styles.textarea}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={isListening ? "Sprechen Sie jetzt..." : "Klicken Sie auf 'Aufnahme starten', um zu beginnen..."}
              rows={12}
              readOnly={isListening}
            />
            <div className={styles.charCount}>
              {transcript.length} Zeichen
              {transcript && ` • ${transcript.split(/\s+/).filter(word => word.length > 0).length} Wörter`}
            </div>
          </div>

          {summary && (
            <div className={styles.summaryContainer}>
              <label htmlFor="summary" className={styles.label}>
                Zusammenfassung
              </label>
              <textarea
                id="summary"
                className={styles.textarea}
                value={summary}
                readOnly
                rows={6}
                placeholder="Die Zusammenfassung wird hier angezeigt..."
              />
            </div>
          )}
        </div>

        <div className={styles.info}>
          <h3>Hinweise:</h3>
          <ul>
            <li>Klicken Sie auf "Aufnahme starten", um die Spracherkennung zu aktivieren</li>
            <li>Ihr Browser wird Sie um Mikrofon-Zugriff bitten - bitte erlauben Sie diesen</li>
            <li>Die Erkennung funktioniert am besten in ruhiger Umgebung</li>
            <li>Sie können den Text während der Aufnahme bearbeiten</li>
            <li>Klicken Sie erneut auf den Button, um die Aufnahme zu stoppen</li>
            <li>Klicken Sie auf "Zusammenfassen", um eine automatische Zusammenfassung der Transkription zu erhalten</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default SpeechToText;

