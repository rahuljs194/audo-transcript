import React, { useEffect, useRef, useState } from "react";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useAtom } from "jotai";
import {
  dSecondAtom,
  durationAtom,
  secondAtom,
  speedAtom,
  timerIdAtom,
} from "../../utils/store";
import "./player.scss";
import AudioWaveForm from "../wave/AudioWaveForm";
import TranscriptSection from "../transcript/TranscriptSection";

const AudioTranscript = () => {
  const audioRef = useRef(null);

  const [timerId, setTimerId] = useAtom(timerIdAtom);
  const [second, setSecond] = useAtom(secondAtom);
  const [decaSecond, setDecaSecond] = useAtom(dSecondAtom);
  const [speed, setSpeed] = useAtom(speedAtom);
  const [duration, setDuration] = useAtom(durationAtom);
  const [startTimer, setStartTimer] = useState(0);

  const onJumpTime = (time) => {
    audioRef.current.audio.current.currentTime = time;
  };

  useEffect(() => {
    let audio = audioRef.current.audio.current;

    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };
  }, []);

  useEffect(() => {
    if (decaSecond >= 999) {
      setSecond((second) => second + 1);
      setDecaSecond(0);
    }
    setDecaSecond((decaSecond) => decaSecond + speed);
  }, [startTimer]);

  const onPlay = () => {
    const timerId = setInterval(
      () => setStartTimer((startTimer) => startTimer + 1),
      25
    );
    setTimerId(timerId);
  };

  const onEnded = () => {
    clearInterval(timerId);
    setSecond(0);
    setDecaSecond(0);
  };

  useEffect(() => {
    if (second < 0 || second + decaSecond / 1000 > duration) {
      setSecond(0);
      setDecaSecond(0);
    }
  }, [second, decaSecond]);

  const onSpeed = () => {
    if (speed === 50) {
      setSpeed(12.5);
      audioRef.current.audio.current.playbackRate = 0.5
      return;
    }
    audioRef.current.audio.current.playbackRate = (speed + 12.5) * 0.04;

    setSpeed(speed + 12.5);
  };

  return (
    <div>
      <div className="audio-player">
        <ReactAudioPlayer
          ref={audioRef}
          src={"audio/transcript-audio.wav"}
          onPlay={onPlay}
          onPause={() => clearInterval(timerId)}
          onEnded={onEnded}
        />
        <div className="controls">
          <div
            className="forward-button"
            onClick={() => setSecond((second) => second + 10)}
          >
            <img
              src={"/images/forward.svg"}
              className="forward-image"
              alt={"forward"}
            />
          </div>
          <div
            className="rewind-button"
            onClick={() => setSecond((second) => second - 10)}
          >
            <img
              src={"/images/rewind.svg"}
              className="rewind-image"
              alt={"rewind"}
            />
          </div>
          <div className="speed-input" onClick={onSpeed}>
            {(speed * 0.04).toFixed(1)}x
          </div>
          <div className="share-image">
            <img src={"/images/share-button.svg"} alt={"share"} />
          </div>
        </div>

        <span className="duration">
          <span>00</span>:<span>{("00" + second).slice(-2)}</span> /{" "}
          <span style={{ color: "#919394" }}>
            {("00" + Math.floor(duration / 60)).slice(-2)}:
          </span>
          <span style={{ color: "#919394" }}>
            {("00" + Math.floor(duration % 60)).slice(-2)}
          </span>
        </span>
      </div>
      <AudioWaveForm onJumpTime={onJumpTime} />
      <TranscriptSection onJumpTime={onJumpTime} />
    </div>
  );
};

export default AudioTranscript;
