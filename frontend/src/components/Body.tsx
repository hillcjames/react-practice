import React, { Component} from "react";

import logo from '../icons/logo.svg';
import '../css/Body.css';
import ToolPane from './ToolPane';
import Display from './Display';


class Body extends Component{
  render(){
    return (
    <div className="Body">
        <ToolPane/>
        <Display/>
    </div>
    );
    }
}

export default Body;
