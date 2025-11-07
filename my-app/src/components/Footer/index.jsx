import React from 'react';

const Footer = ({ github = 'https://github.com/sadio-kanoute/memory_react' }) => (
  <footer className="footer">
    <div>© {new Date().getFullYear()} Memory Game — Tous droits réservés</div>
    <div style={{ marginTop: 6 }}>
      <a href={github} target="_blank" rel="noreferrer" style={{ color: 'var(--muted)' }}>GitHub</a>
    </div>
  </footer>
);

export default Footer;
