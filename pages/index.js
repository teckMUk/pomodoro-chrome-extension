import React, { useState } from "react";
import Head from "next/head";
import Index from "../components/Index";
import New from "../components/New";
import PomodoroTimer from "../components/Pomodoro";
import Timer from "../components/timer";
import PlayButton from "../components/PlayButton";
import ResetButton from "../components/ResetButton";
import SettingsButton from "../components/SettingsButton";
import Settings from "../components/settings";

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  // const [activePage, setActivePage] = useState('index');

  // const navigateToPage = (page) => {
  //   setActivePage(page);
  // };

  // return (
  //   <>
  //     {activePage === 'index' && <Index navigateToPage={navigateToPage} />}
  //     {activePage === 'new' && <New navigateToPage={navigateToPage} />}
  //   </>
  // );
  return (
    <div>
      <Head>
        <title>Pomodoro App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Pomodoro Timer</h1>
        <Timer />
        <PomodoroTimer />
        <PlayButton /> {/* This is a play button consider as start */}
        <ResetButton />
        {/* This is a reset button consider as start */}
        <SettingsButton />
      </main>
    </div>
  );
}
