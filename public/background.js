chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.clearAll(); // Clear any existing alarms
    chrome.storage.local.remove('timerEnd');
    const timerState = { isBreak: false, sessions: 0, workTime: 25, shortBreakTime: 5, longBreakTime: 10 };
    chrome.storage.local.set({ timerState });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'startAlarm') {
      console.log('Got message to start timer');
      startAlarm(message.duration, message.isBreak);
    } else if (message.type === 'clearAlarm') {
      console.log("clearing alram")
      chrome.alarms.clear('pomodoroTimer');
    }
  });
  
  function startAlarm(durationInSeconds, isBreak) {
    console.log("Duration in seconds:", durationInSeconds);
    const endTime = Date.now() + durationInSeconds * 1000;
    chrome.alarms.create('pomodoroTimer', { delayInMinutes: durationInSeconds / 60 });
    chrome.storage.local.set({ timerEnd: endTime, isBreak });
  }
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'pomodoroTimer') {
      console.log("alarm called")
      chrome.storage.local.get(['timerState'], (result) => {
        const timerState = result.timerState;
        console.log("Timer state:", timerState);
        if (timerState.isBreak) {
            const newSessions = (timerState.sessions || 0) + 1;
            const isLongBreak = newSessions >= 4;
            console.log("Break ended");
          // Transition to work time after break
            chrome.notifications.create({
                type: 'basic',
                iconUrl: '/icons/icon48.png',
                title: 'Pomodoro Timer',
                message: 'Break time ended. Starting work session.',
                priority: 2
            });
            startAlarm(timerState.workTime * 60, false);
            timerState.isBreak = false;
            timerState.sessions = isLongBreak ? 0 : newSessions;
            console.log("After break session updates to ",timerState.sessions)
            chrome.storage.local.set({ timerState });
        } else {
          console.log("Work session ended");
          // Transition to break time after work session
          const newSessions = (timerState.sessions || 0) ;
          const isLongBreak = newSessions >= 4;
          const breakDuration = isLongBreak ? timerState.longBreakTime * 60 : timerState.shortBreakTime * 60;
  
          chrome.notifications.create({
            type: 'basic',
            iconUrl: '/icons/icon48.png',
            title: 'Pomodoro Timer',
            message: 'Work session ended. Starting break time.',
            priority: 2
          });
          console.log("Break duration:", breakDuration);
          startAlarm(breakDuration, true);
          timerState.isBreak = true;
          chrome.storage.local.set({ timerState });
        }
      });
    }
  });
  