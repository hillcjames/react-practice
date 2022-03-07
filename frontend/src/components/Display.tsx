import React, { Component, useContext, useEffect, useState  } from "react";

import logo from '../icons/logo.svg';
import '../css/Body.css';
import '../css/Display.css';
import TestDisplay from './TestDisplay';
import SolarSystemDisplay from './SolarSystemDisplay';
import BasicDataTableDisplay from './BasicDataTableDisplay';
import { mainStore } from '../stores/MainStore';
import { useBehavior } from '../hooks/useBehavior';
import { Model, ModelState } from "../types/Model";
import { Planet } from "../types/Planet";
import { modelStore, initialModelState } from '../stores/ModelStore';


export interface DisplayProps {
}

const _Display: React.FC<DisplayProps> = (props: DisplayProps) => {

    const isDisplayOpen = useBehavior(mainStore.isDisplayVisible);
    const solarDataIsLoading = useBehavior(mainStore.solarDataIsLoading);
    const solarDataLoadFailure = useBehavior(mainStore.solarDataLoadFailure);

    const [periodicModelState, setPeriodicModelState] = useState(initialModelState);
    const newSimData = useBehavior(modelStore.newSimData);
    const modelState = useBehavior(modelStore.modelState);
    useEffect(() => {
        setPeriodicModelState({...modelState});
    }, [newSimData]);

    const showDeadPlanets = useBehavior(mainStore.showDeadPlanets);
    const [selectedPlanetID, setSelectedPlanetID] = useState<string>("");


    return (
    <div className="Display">
        {/* <TestDisplay/> */}
        {/* {isDisplayOpen ? <SolarSystemDisplay /> : null } */}
        {/* <div  style={{display: isDisplayOpen ? "block" : "none"}}> */}
            <SolarSystemDisplay />
        {/* </div> */}
        {/* {!isDisplayOpen ? <BasicDataTableDisplay model={periodicModelState} */}
        {isDisplayOpen ? <BasicDataTableDisplay model={periodicModelState}
             rowClickCallback={
            (e: any, row: any) => {
                modelStore.updatePlanetOfReference(row.getData());
            }}
            showDeadPlanets={showDeadPlanets}
            selectedPlanetID={selectedPlanetID}
            setSelectedPlanetID={setSelectedPlanetID}
        /> : null}
    </div>
    );
}

// export default Display;
export const Display = React.memo(_Display);
export default Display;
