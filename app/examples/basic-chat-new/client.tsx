"use client";

import React from "react";
import styles from "./page.module.css";
import Chat from "../../components/chat";
import HomeButton from "../../components/home-button";

type BasicChatClientProps = {
  assistantId: string;
};

const BasicChatClient = ({ assistantId }: BasicChatClientProps) => {
  return (
    <main className={styles.main}>
      <HomeButton />
      <div className={styles.container}>
        <div className={styles.infoBox}>
          <h2 className={styles.infoTitle}>Basis-Chat</h2>
          <p className={styles.infoText}>
            Der Basis-Chat ist ein allgemeiner Chat-Assistent für alle möglichen Aufgaben. 
            Er verwendet eine dedizierte Assistant-ID und kann Ihnen bei vielfältigen Fragen 
            und Anliegen helfen - von allgemeinen Informationen bis hin zu komplexeren Aufgaben.
          </p>
        </div>
        <Chat assistantId={assistantId} />
      </div>
    </main>
  );
};

export default BasicChatClient;




