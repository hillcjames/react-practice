import React, { Component, useContext, useEffect } from "react";

import { Model } from "../types/Model";

import Canvas from "./Canvas"
import logo from '../icons/logo.svg';

import '../css/SolarSystemDisplay.css';


export interface SolarSystemDisplayProps {
    model: Model
}

const _SolarSystemDisplay: React.FC<SolarSystemDisplayProps> = (props) => {

    useEffect(() => {
        console.log("Updating solar!!")
    });

    return (
        <div className="SolarSystemDisplay">
            <Canvas model={props.model}/>
            <p>
              Solar system population: {props.model.state.planetoidList.length}
            </p>
        </div>
    );
}


const SolarSystemDisplay = React.memo(_SolarSystemDisplay);
export default SolarSystemDisplay;
