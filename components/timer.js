import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Timer() {
  return (
    <div>
      <CircularProgressbar value={85} text={`${85}%`} />;
    </div>
  );
}

export default Timer;
