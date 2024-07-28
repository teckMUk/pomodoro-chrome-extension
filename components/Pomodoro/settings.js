import React, { useState, useEffect } from "react";
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
  const [url, setUrl] = useState("");
  const [urlList, setUrlList] = useState([]);

  useEffect(() => {
    // Load stored URLs from chrome local storage
    chrome.storage.local.get("urlList", (result) => {
      if (result.urlList) {
        setUrlList(result.urlList);
      }
    });
  }, []);

  const handleUrlChange = (e) => setUrl(e.target.value);

  const handleAddUrl = () => {
    if (url) {
      const domain = url.split(".")[1];
      const updatedUrlList = [...urlList, domain];
      setUrlList(updatedUrlList);
      setUrl("");
      // Save the updated URL list to chrome local storage
      chrome.storage.local.set({ urlList: updatedUrlList });
    }
  };

  const handleDeleteUrl = (index) => {
    const updatedUrlList = urlList.filter((_, i) => i !== index);
    setUrlList(updatedUrlList);
    // Save the updated URL list to chrome local storage
    chrome.storage.local.set({ urlList: updatedUrlList });
  };

  const handleSaveSettings = () => {
    // Save the settings including URLs to chrome local storage
    chrome.storage.local.set(
      {
        workTime,
        shortBreakTime,
        longBreakTime,
      },
      () => {
        console.log("Settings saved");
      }
    );
    saveSettings();
  };

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
      <label className={styles.label}>
        URL:
        <input type="url" value={url} onChange={handleUrlChange} />
        <button className={styles.controlButton} onClick={handleAddUrl}>
          Add URL
        </button>
      </label>
      <div className={styles.urlList}>
        <h3>Stored URLs:</h3>
        <ul>
          {urlList.map((url, index) => (
            <li key={index} className={styles.li}>
              {url}
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteUrl(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button className={styles.controlButton} onClick={handleSaveSettings}>
        Save
      </button>
    </div>
  );
}
