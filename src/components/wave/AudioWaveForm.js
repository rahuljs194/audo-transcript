import React, { useEffect, useState } from "react";
import { dSecondAtom, durationAtom, secondAtom } from "../../utils/store";
import { useAtom } from "jotai";
import transcriptData from "../../utils/transcript";
import "./audio-wave-form.scss";
import SeekBar from "./SeekBar";
import Waves from "./Waves";

const AudioWaveForm = ({ onJumpTime }) => {
  const [firstPersonWordPercent, setFirstPersonWordPercent] = useState(0);
  const [secondPersonWordPercent, setSecondPersonWordPercent] = useState("");
  const [duration] = useAtom(durationAtom);
  const [widthPercent, setWidthPercent] = useState(0);
  const [second, setSecond] = useAtom(secondAtom);
  const [decaSecond, setDecaSecond] = useAtom(dSecondAtom);

  useEffect(() => {
    const time = second + decaSecond / 1000;
    const percent = (time / duration) * 100;
    setWidthPercent(percent);
  }, [decaSecond, second]);

  useEffect(() => {
    let total = 0,
      wordsFirstPerson = 0;

    transcriptData.transcript_text.forEach((transcript, index) => {
      if (index % 2) {
        total += transcript.length;
      } else {
        wordsFirstPerson += transcript.length;
        total += transcript.length;
      }
    });
    const percentFirstPerson = Math.round((wordsFirstPerson / total) * 100);
    setFirstPersonWordPercent(percentFirstPerson);
    const percentSecondPerson = ("0" + (100 - percentFirstPerson)).slice(-2);
    setSecondPersonWordPercent(percentSecondPerson);
  }, []);

  let previousMarginFirstPerson = 0;
  let previousMarginSecondPerson = 0;
  const getMargin = (startTime, previousMargin) => {
    return (parseFloat(startTime) * 100) / duration - previousMargin;
  };

  return (
    <div className="wave-section">
      <div className="waveform-row">
        <div className="waveform-name first-person">
          {firstPersonWordPercent}% YOU
        </div>
        <div className="waveform-container">
          {transcriptData.word_timings.map((transcript, index) => {
            if (index % 2 !== 0) return;

            const marginLeft = getMargin(
              transcript[0].startTime,
              previousMarginFirstPerson
            );
            previousMarginFirstPerson =
              (parseFloat(transcript[transcript.length - 1].endTime) * 100) /
              duration;

            return (
              <Waves
                transcript={transcript}
                className="waves-first-person"
                duration={duration}
                key={index}
                marginLeft={marginLeft}
              />
            );
          })}
        </div>
      </div>
      <div className="break-line">
        <div className="inactive-line" />
        <div className="breaker" />
        <div className="active-line">
          <div className="bold-line" style={{width: `${widthPercent}%`}}/>
          <div className="normal-line" style={{width: `${100-widthPercent}%`}}/>
        </div>
      </div>
      <div className="waveform-row">
        <div className="waveform-name second-person">
          {secondPersonWordPercent}% prospect
        </div>
        <div className="waveform-container">
          {transcriptData.word_timings.map((transcript, index) => {
            if (index % 2 === 0) return;

            const marginLeft = getMargin(
              transcript[0].startTime,
              previousMarginSecondPerson
            );
            previousMarginSecondPerson =
              (parseFloat(transcript[transcript.length - 1].endTime) * 100) /
              duration;

            return (
              <Waves
                transcript={transcript}
                className="waves-second-person"
                duration={duration}
                key={index}
                marginLeft={marginLeft}
              />
            );
          })}
        </div>
      </div>
      <SeekBar
        onJumpTime={onJumpTime}
        widthPercent={widthPercent}
        setSecond={setSecond}
        setDecaSecond={setDecaSecond}
      />
    </div>
  );
};

export default AudioWaveForm;
