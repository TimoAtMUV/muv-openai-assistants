"use client";

import React, { useState } from "react";
import styles from "./warnings.module.css";
import { assistantId } from "../assistant-config";

const Warnings = () => {
  const [loading, setLoading] = useState(false);
  const [newAssistantId, setNewAssistantId] = useState("");

  const fetchAssistantId = async () => {
    setLoading(true);

    const response = await fetch("/api/assistants", { method: "POST" });
    const data = await response.json();
    setNewAssistantId(data.assistantId);

    setLoading(false);
  };

  return (
    <>
      {!assistantId && (
        <div className={styles.container}>
          <h1>Beginnen Sie mit der Erstellung Ihres Assistenten</h1>
          <div className={styles.message}>
            Erstellen Sie einen Assistenten und setzen Sie seine ID in{" "}
            <span>app/assistant-config.ts</span>
          </div>
          {!newAssistantId ? (
            <button
              onClick={fetchAssistantId}
              disabled={loading}
              className={styles.button}
            >
              {loading ? "Wird geladen..." : "Assistent erstellen"}
            </button>
          ) : (
            <div className={styles.result}>{newAssistantId}</div>
          )}
        </div>
      )}
    </>
  );
};

export default Warnings;
