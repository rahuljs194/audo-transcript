import React from "react";
import { useAtom } from "jotai";
import { dSecondAtom, secondAtom } from "../../utils/store";
import "./transcript-section.scss";
import transcriptData from "../../utils/transcript";

const TranscriptSection = ({ onJumpTime }) => {
  const [second, setSecond] = useAtom(secondAtom);
  const [decaSecond, setDecaSecond] = useAtom(dSecondAtom);

  const time = second + decaSecond / 1000;

  const setTimeAtWordClick = (time) => {
    setSecond(parseInt(time));
    setDecaSecond(Math.ceil((parseFloat(time) - parseInt(time)) * 10) * 100);
    onJumpTime(parseFloat(time));
  };

  return (
    <div className="transcripts">
      {transcriptData.word_timings.map((sentence, index) => {
        let display = "";
        let bg = "";
        if (
          time >= parseFloat(sentence[0].startTime) &&
          time <= parseFloat(sentence[sentence.length - 1].endTime)
        ) {
          bg = "#EDF7FF";
          display = "block";
        }
        return (
          <div
            className="section"
            style={{
              paddingLeft: index % 2 ? "68px" : "20px",
              backgroundColor: bg,
            }}
            key={index}
          >
            <span
              className="transcript-time"
              style={{ color: index % 2 ? "#1991EB" : "#02C797" }}
            >
              <span>00</span>:
              <span>
                {("00" + Math.round(parseFloat(sentence[0].startTime))).slice(
                  -2
                )}
              </span>
            </span>

            <span
              className="divider"
              style={{ borderColor: index % 2 ? "#1991EB" : "#02C797" }}
            />

            <span className="transcript-words">
              {sentence.map((word, i) => (
                <span
                  onClick={() => setTimeAtWordClick(word.startTime)}
                  key={i}
                >
                  {time >= parseFloat(word.startTime) &&
                  time < parseFloat(word.endTime) ? (
                    <a className="word">
                      <span style={{ backgroundColor: "#bbe1fa" }}>
                        {word.word}
                      </span>{" "}
                    </a>
                  ) : (
                    <a className="word">
                      <span>{word.word}</span>{" "}
                    </a>
                  )}
                </span>
              ))}
              <button className="share-button" style={{display}}>Share</button>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TranscriptSection;
