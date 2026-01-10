import { useState } from "react";
import "./App.css";

const DISKS = 2;
const DISK_COLORS = Array.from({length: DISKS}, (_,i) => {
  const hue = (i*360)/DISKS;
  return `hsl(${hue}, 90%, 50%)`;
})
const WIN_TOWER_INDEX = 2;

export default function App() {
  const [towers, setTowers] = useState([
    Array.from({ length: DISKS }, (_, i) => DISKS - i),
    [],
    [],
  ]);
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  function handleTowerClick(towerIndex) {
    if (hasWon) return;

    const tower = towers[towerIndex];

    // Select a disk
    if (selected === null) {
      if (tower.length === 0) return;
      setSelected(towerIndex);
      return;
    }

    // Try to move disk
    const from = selected;
    const to = towerIndex;

    if (from === to) {
      setSelected(null);
      return;
    }

    const disk = towers[from][towers[from].length - 1];
    const targetTop = towers[to][towers[to].length - 1];

    if (!targetTop || disk < targetTop) {
      const newTowers = towers.map((t) => [...t]);
      newTowers[from].pop();
      newTowers[to].push(disk);
      setTowers(newTowers);
      setMoves(moves + 1);

      // Win condition
      if (newTowers[WIN_TOWER_INDEX].length === DISKS) {
        setHasWon(true);
      }
    }

    setSelected(null);
  }

  function resetGame() {
    setTowers([
      Array.from({ length: DISKS }, (_, i) => DISKS - i),
      [],
      [],
    ]);
    setMoves(0);
    setSelected(null);
    setHasWon(false)
  }

  return (
    <div className="app">
      <h1>Towers of Hanoi</h1>
      <p>Moves: {moves}</p>
      {hasWon && (
        <>
          <p className="win">You win!</p>
          <div className="confetti">
            {Array.from({ length: 100 }).map((_, i) => {
              const left = `${Math.random() * 100}%`;
              const backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
              const fall = 2 + Math.random() * 4; // 2s–6s fall duration
              const spin = 0.5 + Math.random() * 2.5; // 0.5s–3s spin duration
              const delay = Math.random() * 2; // 0s–2s start delay
              const fallDir = "normal";;
              const spinDir = Math.random() < 0.5 ? "normal" : "reverse";

              return (
                <span
                  key={i}
                  className="confetti-piece"
                  style={{
                    left,
                    animationDelay: `${delay}s`,
                    animationDirection: fallDir,
                    '--fall-duration': `${fall}s`,
                  }}
                >
                  <span
                    className="confetti-spin"
                    style={{
                      animationDelay: `${delay}s`,
                      animationDirection: spinDir,
                      '--spin-duration': `${spin}s`,
                      backgroundColor,
                    }}
                  />
                </span>
              );
            })}
          </div>
        </>
      )}

      <div className="towers">
        {towers.map((tower, i) => (
          <div
            key={i}
            className={`tower ${selected === i ? "selected" : ""}`}
            onClick={() => handleTowerClick(i)}
          >
            <div className="rod" />
            {tower.map((disk) => (
              <div
                key={disk}
                className="disk"
                style={{ 
                  width: `${160*(disk)/DISKS}px`, 
                  backgroundColor: DISK_COLORS[disk-1]
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <button onClick={resetGame}>Reset</button>
    </div>
  );
}
