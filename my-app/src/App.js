import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import imageList from './imageList';
import Footer from './components/Footer';
import Controls from './components/Controls';
import Card from './components/Card';

// create deck from types (duplicate each type to form a pair, give unique ids)
const createDeckFromTypes = (types, pairCount) => {
  // choose pairCount types from types (repeat if not enough types)
  const chosen = [];
  while (chosen.length < pairCount) {
    const t = types[chosen.length % types.length];
    chosen.push(t);
  }

  const duplicated = chosen.flatMap((t) => [{ ...t }, { ...t }]);
  const withId = duplicated.map((c, i) => ({ ...c, id: i + 1, isFlipped: false, isMatched: false }));
  // simple shuffle
  for (let i = withId.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [withId[i], withId[j]] = [withId[j], withId[i]];
  }
  return withId;
};

function App() {
  // available types (use images in public/assets/img/). If you add more files, add them here.
  // build types from imageList (pairId is index+1)
  const types = imageList.map((src, i) => ({ name: `Card${i+1}`, icon: src, pairId: i + 1 }));
  const maxPairs = types.length;

  const [pairCount, setPairCount] = useState(maxPairs > 0 ? maxPairs : 2);
  const [deck, setDeck] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [victory, setVictory] = useState(false);
  const gridRef = useRef(null);
  const [columns, setColumns] = useState(0);
  const [showStartBanner, setShowStartBanner] = useState(false);

  useEffect(() => {
    // initialize deck using default pairCount
    setDeck(createDeckFromTypes(types, pairCount));
  }, []);

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setIsDisabled(true);
      if (choiceOne.pairId === choiceTwo.pairId) {
        setDeck(prev => prev.map(c => (c.pairId === choiceOne.pairId ? { ...c, isMatched: true, isFlipped: true } : c)));
        resetTurn();
      } else {
        setTimeout(() => {
          setDeck(prev => prev.map(c => (c.id === choiceOne.id || c.id === choiceTwo.id ? { ...c, isFlipped: false } : c)));
          resetTurn();
        }, 800);
      }
      setMoves(m => m + 1);
    }
  }, [choiceTwo]);

  useEffect(() => {
    if (deck.length > 0 && deck.every(c => c.isMatched)) setVictory(true);
  }, [deck]);

  // compute number of columns that fit inside the grid container based on card width
  useEffect(() => {
    const updateColumns = () => {
      const el = gridRef.current;
      if (!el) return setColumns(0);
      const width = el.clientWidth;
      const style = getComputedStyle(document.documentElement);
      const cardW = parseInt(style.getPropertyValue('--card-width')) || 84;
      // gap used in CSS is calc(var(--gap) * 1.5)
      const rawGap = parseInt(style.getPropertyValue('--gap')) || 8;
      const gap = Math.round(rawGap * 1.5);
      const col = Math.max(1, Math.floor((width + gap) / (cardW + gap)));
      setColumns(col);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [deck.length]);

  const handleChoice = (cardClicked) => {
    if (isDisabled || cardClicked.isMatched) return;
    if (choiceOne && choiceOne.id === cardClicked.id) return;

    setDeck(prev => prev.map(c => (c.id === cardClicked.id ? { ...c, isFlipped: true } : c)));
    choiceOne ? setChoiceTwo(cardClicked) : setChoiceOne(cardClicked);
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setIsDisabled(false);
  };

  const handleStart = () => {
    // ensure pairCount not greater than available types
    const effective = Math.min(pairCount, types.length);
    setDeck(createDeckFromTypes(types, effective));
    setChoiceOne(null); setChoiceTwo(null); setIsDisabled(false); setMoves(0); setVictory(false);
    // show a short start banner for immersion
    setShowStartBanner(true);
    setTimeout(() => setShowStartBanner(false), 1100);
  };

  const handleRestart = () => handleStart();

  return (
    <div className="App">
  <NavBar logoSrc={'/assets/img/memory_logo.svg'} />

      <main className="main" style={{
        backgroundImage: `linear-gradient(rgba(15,18,38,0.65), rgba(15,18,38,0.65)), url('/assets/img/kamehouse.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }}>
  {showStartBanner && <div className="start-banner">C'EST PARTI !</div>}
  <Controls pairCount={pairCount} setPairCount={setPairCount} onStart={handleStart} onRestart={handleRestart} moves={moves} maxPairs={maxPairs} />

        {victory && (
          <div className="victory">
            <div className="stars" aria-hidden="true" />
            <div className="win-card" style={{ background: 'var(--surface)' }}>
              <h2>BRAVO !</h2>
              <p>Tu as gagné en {moves} coups.</p>
              <button onClick={handleRestart} style={{ marginTop: 8 }}>Nouvelle partie</button>
            </div>
          </div>
        )}

        {/* grid: we attach a ref and render placeholders so the last row stays aligned */}
        {/** compute placeholders so last row is filled visually **/}
        <section className="grid" ref={gridRef}>
          {deck.map(card => (
            <Card key={card.id} card={card} isFlipped={card.isFlipped} isMatched={card.isMatched} handleChoice={handleChoice} />
          ))}
          {(() => {
            const placeholders = columns ? (columns - (deck.length % columns)) % columns : 0;
            return Array.from({ length: placeholders }).map((_, i) => (
              <div key={`ph-${i}`} className="card-placeholder" />
            ));
          })()}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;

