import React, { useState } from "react";
import Head from "next/head";
import Index from "../components/Index";
import New from "../components/New";
import PomodoroTimer from "../components/Pomodoro";

export default function Home() {
  // const [activePage, setActivePage] = useState("index");

  // const navigateToPage = (page) => {
  //   setActivePage(page);
  // };

  // return (
  //   <>

  //   </>
  // );
  return (
    <div>
      <Head>
        {/* {activePage === "index" && <Index navigateToPage={navigateToPage} />} */}
        {/* {activePage === "new" && <New navigateToPage={navigateToPage} />} */}
        <title>Pomodoro App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <PomodoroTimer />
      </main>
    </div>
  );
}
