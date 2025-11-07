import React from 'react';
import Button from '../Button';

const Controls = ({ pairCount, setPairCount, onStart, onRestart, moves, maxPairs }) => {
  const options = [];
  const minPairs = 2;
  const upper = Math.max(minPairs, maxPairs || minPairs);
  for (let i = minPairs; i <= upper; i++) options.push(i);

  return (
    <div className="controls">
      <div className="selectPairs" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label style={{ color: 'var(--muted)' }}>Paires :</label>
        <select value={pairCount} onChange={(e) => setPairCount(Number(e.target.value))}>
          {options.map(n => (
            <option key={n} value={n}>{n} paires</option>
          ))}
        </select>
        <Button onClick={() => setPairCount(upper)} title="Utiliser le maximum">Max ({upper})</Button>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button className="start" onClick={onStart}>Start</Button>
        <Button onClick={onRestart}>Restart</Button>
        <div style={{ marginLeft: 8 }}>Moves: {moves}</div>
      </div>
    </div>
  );
};

export default Controls;
