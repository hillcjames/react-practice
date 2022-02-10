import React, { Component, useContext, useEffect } from "react";

import logo from '../icons/logo.svg';
import { Model } from '../types/Model';
import { ModelContext } from '../App';


export interface SolarSystemDisplayProps {
}

const _SolarSystemDisplay: React.FC<SolarSystemDisplayProps> = (props) => {
    const modelContext = useContext(ModelContext);

    useEffect(() => {
        console.log("Updating!!")
    });

    return (
    <ModelContext.Provider value={modelContext}>
        <div className="SolarSystemDisplay">
            <p>
              This is a solar system (eventually)
            </p>
            {modelContext.value}
        </div>
    </ModelContext.Provider>
    );
}

const SolarSystemDisplay = React.memo(_SolarSystemDisplay);
export default SolarSystemDisplay;
