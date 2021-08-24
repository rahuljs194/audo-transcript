import React from "react";
import "./seek-bar.scss";
import { useAtom } from "jotai";
import { durationAtom } from "../../utils/store";

const SeekBar = ({ onJumpTime, setDecaSecond, setSecond, widthPercent }) => {
  const [duration] = useAtom(durationAtom);

  const setTime = (e) => {
    let seekBarWidth;
    if (e.target.className === "seek-line") {
      seekBarWidth = e.target.parentElement.offsetWidth;
    } else {
      seekBarWidth = e.target.offsetWidth;
    }
    const waveTime = e.nativeEvent.offsetX / seekBarWidth;
    const audioTime = waveTime * duration;
    setSecond(Math.floor(audioTime));
    setDecaSecond(Math.round((audioTime - Math.floor(audioTime)) * 10) * 100);
    onJumpTime(audioTime);
  };

  return (
    <div className="seek-bar" onClick={setTime}>
      <div
        className="seek-line"
        style={{
          width: `${widthPercent}%`,
        }}
      />
    </div>
  );
};

export default SeekBar;
