import { useState } from "react";

import { useGame } from "./use-game";
import "./App.css";

export const App = () => {
  const { board, tick, toggleCell, reset } = useGame({ width: 12, height: 12 });
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const play = () => {
    if (intervalId) return;
    setIntervalId(setInterval(() => tick(), 500));
  };

  const pause = () => {
    if (!intervalId) return;
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const isPlaying = intervalId !== null;

  return (
    <div>
      <div className="container">
        <table>
          <tbody>
            {board.map((row, index) => (
              <tr key={`row-${index}`} id="">
                {row.map((cell, index) => (
                  <td
                    key={`cell-${cell.x}-${cell.y}-${index}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleCell(cell)}
                  >
                    <div
                      className={`cell ${cell.state ? "cell--alive" : ""}`}
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="buttons">
        <button onClick={() => tick()}>
          <i className="fa fa-redo-alt" />
          tick
        </button>

        {isPlaying ? (
          <button onClick={() => pause()}>
            <i className="fa fa-pause" />
            pause
          </button>
        ) : (
          <button onClick={() => play()}>
            <i className="fa fa-play" />
            play
          </button>
        )}

        <button
          onClick={() => {
            pause();
            reset();
          }}
        >
          <i className="fa fa-times" />
          reset
        </button>
      </div>
    </div>
  );
};
