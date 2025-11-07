import React from 'react';

const Button = ({ children, className = '', onClick, title, type = 'button', ...rest }) => {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      title={title}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
