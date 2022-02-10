import React, { Component} from "react";

import logo from '../icons/logo.svg';


class TestDisplay extends Component{
  render(){
    return (
    <div className="TestDisplay">
        <img src={logo} className="Body-logo" alt="logo" />
        <p>
          This is a Display4!
        </p>
    </div>
    );
    }
}

export default TestDisplay;
