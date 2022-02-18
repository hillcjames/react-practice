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
            <p>
              This is a solar system (eventually)
            </p>
            {props.model.state.numPlanets}
            <Canvas model={props.model}/>
        </div>
    );
}


const SolarSystemDisplay = React.memo(_SolarSystemDisplay);
export default SolarSystemDisplay;
