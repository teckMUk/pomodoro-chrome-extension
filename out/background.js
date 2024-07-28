chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.clearAll(); // Clear any existing alarms
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'startAlarm') {
      startAlarm(message.duration);
    } else if (message.type === 'clearAlarm') {
      chrome.alarms.clear('pomodoroTimer');
    }
  });
  
  function startAlarm(durationInSeconds) {
    const endTime = Date.now() + durationInSeconds * 1000;
    chrome.alarms.create('pomodoroTimer', { delayInMinutes: durationInSeconds / 60 });
    chrome.storage.local.set({ timerEnd: endTime });
  }
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'pomodoroTimer') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '/icons/icon48.png',
        title: 'Pomodoro Timer',
        message: 'Time is up!',
        priority: 2
      });
      chrome.storage.local.remove(['timerEnd', 'isActive']);
    }
  });
  