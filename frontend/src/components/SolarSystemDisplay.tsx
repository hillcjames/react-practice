import React, { Component, useContext, useEffect, useState } from "react";

import { Model, ModelState } from "../types/Model";
import { Planet } from "../types/Planet";

import { mainStore } from '../stores/MainStore';
import { modelStore } from '../stores/ModelStore';
import { useBehavior } from '../hooks/useBehavior';

import SimpleCanvas from "./SimpleCanvas"
import P5Canvas from "./P5Canvas"
import logo from '../icons/logo.svg';
import { Vector2d } from "../types/Vector2d";

import '../css/SolarSystemDisplay.css';


export interface SolarSystemDisplayProps {
}

const _SolarSystemDisplay: React.FC<SolarSystemDisplayProps> = (props) => {

    const [headCount, setHeadCount] = useState(0);
    const modelState: ModelState = useBehavior(modelStore.modelState);
    const universeWidth = useBehavior(mainStore.universeWidth);
    const universeHeight = useBehavior(mainStore.universeHeight);

    const newSimData = useBehavior(modelStore.newSimData);

    useEffect(() => {
        // console.log("Updating SolarSystemDisplay useEffect ", newSimData);
        let _headCount = 0;
        for (let p of modelState.planets) {
            if (!p.dead) {
                _headCount++;
            }
        }
        setHeadCount(_headCount);
    }, [newSimData]);


    return (
        <div className="SolarSystemDisplay">
            {/* <SimpleCanvas model={props.model}/> */}
            <P5Canvas/>
            <div>
              Solar system population: {headCount}
              {/* , size: {universeWidth} {universeHeight} */}
          </div>
        </div>
    );
}


const SolarSystemDisplay = React.memo(_SolarSystemDisplay);
export default SolarSystemDisplay;
