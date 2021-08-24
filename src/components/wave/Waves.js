import React from "react";




const Waves = ({ className, duration, transcript, marginLeft }) => {


  const getWidth = (startTime, endTime) => {
    return ((parseFloat(endTime) - parseFloat(startTime)) * 100) / duration;
  };
  const width = getWidth(
    transcript[0].startTime,
    transcript[transcript.length - 1].endTime
  );
  return (
    <div
      className={className}
      style={{ width: `${width}%`, marginLeft: `${marginLeft}%` }}
    />
  );
};

export default Waves;
