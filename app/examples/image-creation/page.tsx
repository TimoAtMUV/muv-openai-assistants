"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import HomeButton from "../../components/home-button";

type ImageData = {
  url: string;
  revised_prompt?: string;
};

const ImageCreation = () => {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState<"1024x1024" | "1792x1024" | "1024x1792">("1024x1024");
  const [quality, setQuality] = useState<"standard" | "hd">("standard");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Bitte geben Sie eine Eingabeaufforderung ein");
      return;
    }

    setLoading(true);
    setError(null);
    setImages([]);

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          size: size,
          quality: quality,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bild konnte nicht generiert werden");
      }

      setImages(data.images || []);
    } catch (err: any) {
      setError(err.message || "Beim Generieren des Bildes ist ein Fehler aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, index: number) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `image-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  return (
    <main className={styles.main}>
      <HomeButton />
      <div className={styles.container}>
        <h1 className={styles.title}>Bildgenerierung mit DALL-E</h1>
        
        <div className={styles.controls}>
          <div className={styles.inputGroup}>
            <label htmlFor="prompt">Eingabeaufforderung</label>
            <textarea
              id="prompt"
              className={styles.textarea}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beschreiben Sie das Bild, das Sie erstellen möchten..."
              rows={3}
            />
          </div>

          <div className={styles.options}>
            <div className={styles.inputGroup}>
              <label htmlFor="size">Größe</label>
              <select
                id="size"
                className={styles.select}
                value={size}
                onChange={(e) => setSize(e.target.value as typeof size)}
              >
                <option value="1024x1024">1024x1024 (Quadratisch)</option>
                <option value="1792x1024">1792x1024 (Querformat)</option>
                <option value="1024x1792">1024x1792 (Hochformat)</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="quality">Qualität</label>
              <select
                id="quality"
                className={styles.select}
                value={quality}
                onChange={(e) => setQuality(e.target.value as typeof quality)}
              >
                <option value="standard">Standard</option>
                <option value="hd">HD</option>
              </select>
            </div>
          </div>

          <button
            className={styles.button}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Wird generiert..." : "Bild generieren"}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {images.length > 0 && (
          <div className={styles.images}>
            {images.map((image, index) => (
              <div key={index} className={styles.imageContainer}>
                <img
                  src={image.url}
                  alt={`Generiertes Bild ${index + 1}`}
                  className={styles.image}
                />
                {image.revised_prompt && (
                  <div className={styles.revisedPrompt}>
                    <strong>Überarbeitete Eingabeaufforderung:</strong> {image.revised_prompt}
                  </div>
                )}
                <button
                  className={styles.downloadButton}
                  onClick={() => handleDownload(image.url, index)}
                >
                  Herunterladen
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ImageCreation;

