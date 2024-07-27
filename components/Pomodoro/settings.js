import React from "react";
import styles from "./Pomodoro.module.css";

export default function Settings({
  workTime,
  shortBreakTime,
  longBreakTime,
  handleWorkTimeChange,
  handleShortBreakTimeChange,
  handleLongBreakTimeChange,
  saveSettings,
}) {
  return (
    <div className={styles.settings}>
      <label className={styles.label}>
        Work Time:
        <input type="number" value={workTime} onChange={handleWorkTimeChange} />
      </label>
      <label className={styles.label}>
        Short Break:
        <input
          type="number"
          value={shortBreakTime}
          onChange={handleShortBreakTimeChange}
        />
      </label>
      <label className={styles.label}>
        Long Break:
        <input
          type="number"
          value={longBreakTime}
          onChange={handleLongBreakTimeChange}
        />
      </label>
      <button className={styles.controlButton} onClick={saveSettings}>
        Save
      </button>
    </div>
  );
}
