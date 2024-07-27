import Timer from "../../components/timer";

const Popup: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Pomodoro Timer</h1>
      <div className="timers">
        <div className="timer-container">
          <Timer initialMinutes={25} />
        </div>
      </div>
    </div>
  );
};

export default Popup;