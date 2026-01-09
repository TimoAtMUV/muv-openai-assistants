"use client";

import React from "react";
import styles from "./page.module.css";
import Chat from "../../components/chat";
import HomeButton from "../../components/home-button";

const Home = () => {
  return (
    <main className={styles.main}>
      <HomeButton />
      <div className={styles.container}>
        <div className={styles.infoBox}>
          <h2 className={styles.infoTitle}>Gebäudetechnik-Tutor</h2>
          <p className={styles.infoText}>
            Dieser Assistent ist ein didaktischer KI-Tutor für HLKS/MSR/TGA-Techniker: 
            Er stellt zuerst Rückfragen, erklärt Zusammenhänge und Lösungswege Schritt für Schritt 
            und praxisnah (inkl. typische Fehlerbilder, Normenbezug und Rechenlogik), 
            statt sofort fertige Endlösungen zu liefern. Dabei trennt er Fakten von Annahmen, 
            weist auf Prüf- und Sicherheitsgrenzen hin und beendet längere Antworten mit einer 
            Praxis- oder Reflexionsfrage.
          </p>
        </div>
        <Chat />
      </div>
    </main>
  );
};

export default Home;
