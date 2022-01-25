import React, { Component} from "react";

import logo from '../icons/logo.svg';
import '../css/Header.css';


class Header extends Component{
  render(){
    return (
    <div className="Header">
      <header className="Header-header">
        <img src={logo} className="Header-logo" alt="logo" />
        <p>
          This is a header!
        </p>
      </header>
    </div>
    );
    }
}

export default Header;
