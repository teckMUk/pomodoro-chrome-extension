import React, { useState } from 'react';
import Head from 'next/head';
import Index from '../components/Index';
import New from '../components/New';
import PomodoroTimer from '../components/Pomodoro'

export default function Home() {
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
        <PomodoroTimer />
      </main>
    </div>
  );
}
