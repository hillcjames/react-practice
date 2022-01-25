import React, { Component} from "react";

import logo from '../icons/logo.svg';
import '../css/Body.css';
import '../css/ToolPane.css';


class ToolPane extends Component{
  render(){
    return (
    <div className="ToolPane">
        <img src={logo} className="Body-logo" alt="logo" />
        <p>
          This is a ToolPane!
        </p>
    </div>
    );
    }
}

export default ToolPane;
