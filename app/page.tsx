"use client";

import React from "react";
import styles from "./page.module.css";

const Home = () => {
  const categories = {
    "💬 KI-Chat": "basic-chat-new",
    //"🏗️ KI Assistent": "basic-chat",
    "🎨 Bildgenerierung": "image-creation",
    "🔍 Bild-Interpreter": "image-interpreter",
    "🔊 Sprachgenerierung": "voice-generation",
    "🎤 Sprache zu Text": "speech-to-text",
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        AI-Apps erkunden
      </div>
      <div className={styles.container}>
        {Object.entries(categories).map(([name, url]) => (
          <a key={name} className={styles.category} href={`/examples/${url}`}>
            {name}
          </a>
        ))}
      </div>
    </main>
  );
};

export default Home;
