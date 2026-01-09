"use client";

import React, { useState, useRef } from "react";
import styles from "./page.module.css";
import HomeButton from "../../components/home-button";

const ImageInterpreter = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("Beschreibe dieses Bild im Detail.");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Bitte wählen Sie eine Bilddatei aus.");
        return;
      }
      setImage(file);
      setError(null);
      setAnalysis(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError("Bitte wählen Sie zuerst ein Bild aus.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("prompt", prompt);

      const response = await fetch("/api/image-interpreter", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bild konnte nicht analysiert werden");
      }

      setAnalysis(data.analysis || "Keine Analyse verfügbar.");
    } catch (err: any) {
      setError(err.message || "Beim Analysieren des Bildes ist ein Fehler aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className={styles.main}>
      <HomeButton />
      <div className={styles.container}>
        <h1 className={styles.title}>Bild-Interpreter</h1>
        
        <div className={styles.controls}>
          <div className={styles.inputGroup}>
            <label htmlFor="image-upload">Bild auswählen</label>
            <div className={styles.uploadArea}>
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className={styles.fileInput}
              />
              <label htmlFor="image-upload" className={styles.uploadButton}>
                {image ? "Bild ändern" : "Bild auswählen"}
              </label>
              {image && (
                <span className={styles.fileName}>{image.name}</span>
              )}
            </div>
          </div>

          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="Vorschau" className={styles.previewImage} />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="prompt">Frage oder Anweisung</label>
            <textarea
              id="prompt"
              className={styles.textarea}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beschreibe dieses Bild im Detail..."
              rows={3}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={styles.button}
              onClick={handleAnalyze}
              disabled={loading || !image}
            >
              {loading ? "Wird analysiert..." : "Bild analysieren"}
            </button>
            {image && (
              <button
                className={styles.clearButton}
                onClick={handleClear}
                disabled={loading}
              >
                Zurücksetzen
              </button>
            )}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {analysis && (
          <div className={styles.analysisContainer}>
            <h2 className={styles.analysisTitle}>Analyse</h2>
            <div className={styles.analysisText}>{analysis}</div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ImageInterpreter;

