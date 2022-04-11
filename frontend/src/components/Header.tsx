import * as React from "react";

import reactLogo from '../icons/logo.svg';
import customLogo from '../icons/spinningIcon.png';
// import rbitalPlaygroundPng from '../icons/rbitalPlayground.png';
import rbitalPng from '../icons/rbital.png';

import '../css/Header.css';

// export interface HeaderProps {
//     model: Model;
// }

// const _Header: React.FC<HeaderProps> = (model: Model) => {
const _Header: React.FC<{}> = () => {


    return (
    <div className="Header">
      <header className="Header-header">
        <div className="logo-container">
          <img src={customLogo} className="Header-logo1 logo1" alt="logo" />
          <img src={customLogo} className="Header-logo2 logo2" alt="logo" />
          <img src={rbitalPng} className="title-text" alt="logo" />
        </div>
        <p className="title">
        </p>
      </header>
    </div>
    );
}

export const Header = React.memo(_Header);
export default Header;
