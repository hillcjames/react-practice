import * as React from "react";

import logo from '../icons/logo.svg';
import '../css/Header.css';

import { modelStore } from '../stores/ModelStore';
import { useBehavior } from '../hooks/useBehavior';


// export interface HeaderProps {
//     model: Model;
// }

// const _Header: React.FC<HeaderProps> = (model: Model) => {
const _Header: React.FC<{}> = () => {

    const planetCounter = useBehavior(modelStore.planetCounter);

    return (
    <div className="Header">
      <header className="Header-header">
        <img src={logo} className="Header-logo" alt="logo" />
        <p>
          This is a header! And there are currently {planetCounter} planets.
        </p>
      </header>
    </div>
    );
}

export const Header = React.memo(_Header);
export default Header;
