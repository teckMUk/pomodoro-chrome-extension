import React, { useState, useEffect } from "react";
import styles from "./Pomodoro.module.css";
import Settings from "./settings";

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
            if (isBreak) {
              // End of break
              setSessions(sessions + 1);
              if (sessions === 3) {
                // Long break after 4 work sessions
                setMinutes(longBreakTime);
                setSessions(0);
              } else {
                // Short break
                setMinutes(shortBreakTime);
              }
              setIsBreak(true);
            } else {
              // End of work session
              setMinutes(workTime);
              setIsBreak(false);
            }
            setSeconds(0);
            setIsActive(false); // Stop the timer when session ends
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

  useEffect(() => {
    // Reset the timer when settings change
    if (!isActive) {
      setMinutes(isBreak ? shortBreakTime : workTime);
      setSeconds(0);
    }
  }, [workTime, shortBreakTime, longBreakTime, isBreak, isActive]);

  const toggleStartStop = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(workTime);
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

  return (
    <div className={styles.pomodoro}>
      {isSettingsScreen ? (
        <Settings
          workTime={workTime}
          shortBreakTime={shortBreakTime}
          longBreakTime={longBreakTime}
          handleWorkTimeChange={(e) => setWorkTime(Number(e.target.value))}
          handleShortBreakTimeChange={(e) =>
            setShortBreakTime(Number(e.target.value))
          }
          handleLongBreakTimeChange={(e) =>
            setLongBreakTime(Number(e.target.value))
          }
          saveSettings={() => {
            resetTimer();
            setIsSettingsScreen(false);
          }}
        />
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
