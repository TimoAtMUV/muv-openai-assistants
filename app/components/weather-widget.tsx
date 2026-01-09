import React from "react";
import styles from "./weather-widget.module.css";

const WeatherWidget = ({
  location = "---",
  temperature = "---",
  conditions = "Sonnig",
  isEmpty = false,
}) => {
  const conditionClassMap = {
    Bewölkt: styles.weatherBGCloudy,
    Sonnig: styles.weatherBGSunny,
    Regnerisch: styles.weatherBGRainy,
    Schneeig: styles.weatherBGSnowy,
    Windig: styles.weatherBGWindy,
  };

  if (isEmpty) {
    return (
      <div className={`${styles.weatherWidget} ${styles.weatherEmptyState}`}>
        <div className={styles.weatherWidgetData}>
          <p>Geben Sie eine Stadt ein, um das lokale Wetter zu sehen</p>
          <p>Versuchen Sie: Wie ist das Wetter in Berlin?</p>
        </div>
      </div>
    );
  }

  const weatherClass = `${styles.weatherWidget} ${
    conditionClassMap[conditions] || styles.weatherBGSunny
  }`;

  return (
    <div className={weatherClass}>
      <div className={styles.weatherWidgetData}>
        <p>{location}</p>
        <h2>{temperature !== "---" ? `${temperature}°F` : temperature}</h2>
        <p>{conditions}</p>
      </div>
    </div>
  );
};

export default WeatherWidget;
