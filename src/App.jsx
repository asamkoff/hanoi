import { useState } from "react";

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
      <style>{css}</style>
      <h1>Towers of Hanoi</h1>
      <p>Moves: {moves}</p>
      {hasWon && (
        <>
          <p className="win">You win!</p>
          <div className="confetti">
            {Array.from({ length: 60 }).map((_, i) => (
              <span key={i} className="confetti-piece" />
            ))}
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

const css = `
.app {
  font-family: sans-serif;
  text-align: center;
  padding: 20px;
}

.towers {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 40px 0;
}

.tower {
  position: relative;
  width: 160px;
  height: 220px;
  border-bottom: 4px solid #444;
  cursor: pointer;

  display: flex;
  flex-direction: column-reverse;
  // align-items: center;
}

.tower.selected {
  background: rgba(0, 0, 0, 0.05);
}

.rod {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 180px;
  background: #555;
}

.disk {
  position: relative;
  height: 20px;
  margin: 2px auto;
  background: #4a90e2;
  border-radius: 4px;
}

.confetti {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 12px;
  background: hsl(calc(360 * var(--i)), 80%, 60%);
  top: -20px;
  left: calc(100% * random());
  animation: fall 3s linear infinite;
}

button {
  padding: 8px 16px;
  font-size: 16px;
}
`;
