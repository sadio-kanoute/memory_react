import React from 'react';

const NavBar = ({ logoSrc }) => {
  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {logoSrc && <img src={logoSrc} alt="Memory logo" style={{ height: 40, borderRadius: 6 }} />}
      </div>
    </header>
  );
};

export default NavBar;
