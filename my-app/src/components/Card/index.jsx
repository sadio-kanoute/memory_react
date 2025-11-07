
import React from 'react';

const Card = ({ card, isFlipped, isMatched, handleChoice }) => {
  const flipped = !!(isFlipped || isMatched);
  const backSrc = '/assets/img/memory_logo.svg'; // use project logo as back of card

  const onSelect = () => {
    if (typeof handleChoice === 'function') handleChoice(card);
  };

  return (
    <button
      type="button"
      className={`card-outer ${flipped ? 'flipped' : ''}`}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
      data-card-key={card?.id}
      aria-pressed={flipped}
    >
      <div className="card-inner">
        {/* front should be the back-of-card visual (visible when NOT flipped) */}
        <div className="card-face card-front">
          <img src={backSrc} alt="card back" />
        </div>

        {/* back contains the character image and is revealed when flipped */}
        <div className="card-face card-back">
          {card?.icon ? <img src={card.icon} alt={card.name || 'card'} /> : <div>{card?.name}</div>}
        </div>
      </div>
    </button>
  );
};

export default Card;