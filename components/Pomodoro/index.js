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
  const [isBlocked,setIsBlocked] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(['timerEnd', 'timerState'], function(result) {
      if (result.timerState) {
        const { isBreak, sessions, workTime, shortBreakTime, longBreakTime, isBlocked } = result.timerState;
        setIsBreak(isBreak);
        setSessions(sessions);
        setWorkTime(workTime);
        setShortBreakTime(shortBreakTime);
        setLongBreakTime(longBreakTime);
        setIsBlocked(isBlocked)
      }
      if (result.timerEnd) {
        const remainingTime = Math.max((result.timerEnd - Date.now()) / 1000, 0);
        setMinutes(Math.floor(remainingTime / 60));
        setSeconds(Math.floor(remainingTime % 60));
        setIsActive(remainingTime > 0);
      }
    });toggleStartStop
  }, []);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        handleTimerTick();
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);

  useEffect(() => {
    if (!isActive) {
      resetTimer();
    }
  }, [workTime, shortBreakTime, longBreakTime, isBreak]);
  useEffect(()=>{
    saveTimerState()
  },[isBlocked]);
  
  const saveTimerState = () => {
    const timerState = { isBreak, sessions, workTime, shortBreakTime, longBreakTime, isBlocked };
    console.log("I am saving timer",timerState)
    chrome.storage.local.set({ timerState });
  };

  const handleTimerTick = () => {
    if (seconds === 0) {
      if (minutes === 0) {
        handleSessionEnd();
      } else {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    } else {
      setSeconds(seconds - 1);
    }
    saveTimerState();
  };

  const handleSessionEnd = () => {
    if (isBreak) {
      //setIsActive(false)
      setIsBreak(false);
      resetTimer();
      setSessions(sessions+1)
    } else {
      const breakDuration = sessions + 1 === 4 ? longBreakTime * 60 : shortBreakTime * 60;
      setMinutes(Math.floor(breakDuration / 60));
      setSeconds(breakDuration % 60);
      setIsBreak(true);
      startTimer(breakDuration, true);
    }
    saveTimerState();
  };

  const resetTimer = () => {
    setMinutes(isBreak ? shortBreakTime : workTime);
    setSeconds(0);
    setIsBreak(false);
    //setSessions(0);
    saveTimerState();
  };

  const startTimer = (duration, isBreak) => {
    const totalSeconds = duration;
    if(!isActive){
      setIsActive(true);
      setIsBlocked(true);
      chrome.runtime.sendMessage({ type: 'startAlarm', duration: totalSeconds, isBreak });
      
    }
    if (isBreak){
      setIsBlocked(false)
    }
    saveTimerState();
  };

  const toggleStartStop = () => {
    if (!isActive){
      const totalSeconds = minutes * 60 + seconds;
      startTimer(totalSeconds, isBreak);
    }else {
      setIsActive(false);
      setIsBlocked(false);
      console.log("isblocked",isBlocked)
      saveTimerState();
      chrome.runtime.sendMessage({ type: 'clearAlarm' , });

    }
  };

  const handleResetClick = () => {
    setIsActive(false);
    resetTimer();
    setSessions(0)
    chrome.runtime.sendMessage({ type: 'clearAlarm' });
    chrome.storage.local.remove('timerEnd');
    setIsBlocked(false)
    saveTimerState();
  };

  const incrementMinutes = () => setMinutes(minutes + 1);

  const decrementMinutes = () => {
    if (minutes > 0) setMinutes(minutes - 1);
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
            setSessions(0);
            chrome.runtime.sendMessage({ type: 'clearAlarm' });
            chrome.storage.local.remove('timerEnd');
            setIsBlocked(false);
            setIsActive(false)
            saveTimerState();
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
            <button className={styles.controlButton} onClick={handleResetClick}>
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
