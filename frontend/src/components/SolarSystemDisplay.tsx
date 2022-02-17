import React, { Component, useContext, useEffect } from "react";

import { Model } from "../types/Model";
import { modelStore } from '../stores/ModelStore';
import { useBehavior } from '../hooks/useBehavior';
import Canvas from "./Canvas"
import logo from '../icons/logo.svg';


export interface SolarSystemDisplayProps {
    model: Model
}

const _SolarSystemDisplay: React.FC<SolarSystemDisplayProps> = (props) => {

    const planetCounter = useBehavior(modelStore.planetCounter);


    useEffect(() => {
        console.log("Updating solar!!")
    });

    return (
        <div className="SolarSystemDisplay">
            <p>
              This is a solar system (eventually)
              <Canvas/>
            </p>
            {props.model.state.numPlanets}
        </div>
    );
}


const SolarSystemDisplay = React.memo(_SolarSystemDisplay);
export default SolarSystemDisplay;
