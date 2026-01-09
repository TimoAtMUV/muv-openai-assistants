"use client";

import React from "react";
import Link from "next/link";
import styles from "./home-button.module.css";

const HomeButton = () => {
  return (
    <Link href="/" className={styles.homeButton}>
      🏠 Startseite
    </Link>
  );
};

export default HomeButton;

