import React from 'react';
import logo from './toplogo.png';
import './header.css';

function Header() {
  return (
      <div className="app-header">
        <img src={logo} className="logo" alt="logo" />
      </div>
  );
}

export default Header;
