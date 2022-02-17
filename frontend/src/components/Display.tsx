import React, { Component, useContext, useEffect  } from "react";

import logo from '../icons/logo.svg';
import '../css/Body.css';
import '../css/Display.css';
import TestDisplay from './TestDisplay';
import SolarSystemDisplay from './SolarSystemDisplay';
import { mainStore } from '../stores/MainStore';
import { useBehavior } from '../hooks/useBehavior';
import { Model } from "../types/Model";
import { modelStore } from '../stores/ModelStore';


export interface DisplayProps {
    model: Model;
}

const _Display: React.FC<DisplayProps> = (props: DisplayProps) => {

    const isSolarOpen = useBehavior(mainStore.isSolarDisplayVisible);

    useEffect(() => {
        console.log("Updating Display!!")
    });

    return (
    <div className="Display">
        {/* <TestDisplay/> */}
        {isSolarOpen ? <SolarSystemDisplay model={props.model}/> : null }
        {/* {isSolarOpen ? <OtherDisplay numPlanets={numPlanets}/> : null } */}
    </div>
    );
}

// export default Display;
export const Display = React.memo(_Display);
export default Display;
