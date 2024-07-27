import React, { useState, useEffect } from "react";
import styles from "./Pomodoro.module.css";

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [workTime, setWorkTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [isSettingsScreen, setIsSettingsScreen] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            if (isBreak) {
              setSessions(sessions + 1);
              setIsBreak(false);
              setMinutes(workTime);
            } else {
              if (sessions === 3) {
                setMinutes(longBreakTime);
                setSessions(0);
              } else {
                setMinutes(shortBreakTime);
                setIsBreak(true);
              }
            }
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    seconds,
    minutes,
    isBreak,
    sessions,
    workTime,
    shortBreakTime,
    longBreakTime,
  ]);

  const toggleStartStop = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    setIsBreak(false);
    setSessions(0);
  };

  const incrementMinutes = () => {
    setMinutes(minutes + 1);
  };

  const decrementMinutes = () => {
    if (minutes > 0) {
      setMinutes(minutes - 1);
    }
  };

  const handleWorkTimeChange = (e) => {
    setWorkTime(Number(e.target.value));
  };

  const handleShortBreakTimeChange = (e) => {
    setShortBreakTime(Number(e.target.value));
  };

  const handleLongBreakTimeChange = (e) => {
    setLongBreakTime(Number(e.target.value));
  };

  const saveSettings = () => {
    resetTimer();
    setIsSettingsScreen(false);
  };

  return (
    <div className={styles.pomodoro}>
      {isSettingsScreen ? (
        <div className={styles.settings}>
          <label className={styles.label}>
            Work Time:
            <input
              type="number"
              value={workTime}
              onChange={handleWorkTimeChange}
            />
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
      ) : (
        <div className={styles.timerScreen}>
          <h1>{isBreak ? "Break Time" : "Work Time"}</h1>
          <div className={styles.timer}>
            <button className={styles.timerButton} onClick={decrementMinutes}>
              -
            </button>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            <button className={styles.timerButton} onClick={incrementMinutes}>
              +
            </button>
          </div>
          <div className={styles.controls}>
            <button className={styles.controlButton} onClick={toggleStartStop}>
              {isActive ? "Pause" : "Start"}
            </button>
            <button className={styles.controlButton} onClick={resetTimer}>
              Reset
            </button>
          </div>
          <p>Session {sessions + 1}/4</p>
          <button
            className={styles.settingsButton}
            onClick={() => setIsSettingsScreen(true)}
          >
            Settings
          </button>
        </div>
      )}
    </div>
  );
}
