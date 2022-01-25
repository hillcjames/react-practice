import React, { Component} from "react";

import logo from '../icons/logo.svg';
import '../css/Body.css';
import '../css/Display.css';


class Display extends Component{
  render(){
    return (
    <div className="Display">
        <img src={logo} className="Body-logo" alt="logo" />
        <p>
          This is a Display!
        </p>
    </div>
    );
    }
}

export default Display;
