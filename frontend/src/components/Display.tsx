import React, { Component, useContext, useEffect, useState  } from "react";
import { Tabs, Tab } from "@blueprintjs/core";

import SolarSystemDisplay from './SolarSystemDisplay';
import BasicDataTableDisplay from './BasicDataTableDisplay';
import DataTable from './DataTable';

import { useBehavior } from '../hooks/useBehavior';
import { ModelState } from "../types/Model";
import { Planet } from "../types/Planet";

import { mainStore, Displays } from '../stores/MainStore';
import { modelStore, initialModelState } from '../stores/ModelStore';

import logo from '../icons/logo.svg';
import '../css/Body.css';
import '../css/Display.css';


export interface DisplayProps {
}

const _Display: React.FC<DisplayProps> = (props: DisplayProps) => {

    const currentDisplay = useBehavior(mainStore.currentDisplay);
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
    <div className="display-outer-block">
        <div className="display" style={{display: currentDisplay === Displays.SOLAR ? "block" : "none"}}>
            <SolarSystemDisplay />
        </div>
        {/* {!isDisplayOpen ? <BasicDataTableDisplay model={periodicModelState} */}
        {/* {isDisplayOpen ? <BasicDataTableDisplay model={periodicModelState}
             rowClickCallback={
            (e: any, row: any) => {
                modelStore.updatePlanetOfReference(row.getData());
            }}
            selectedPlanetID={selectedPlanetID}
            setSelectedPlanetID={setSelectedPlanetID}
        /> : null} */}
        {currentDisplay === Displays.DATA ? <Tabs
            animate={true}
            key={"vertical"}
            vertical={false}>
            <Tab id="rx" title="Tab1" panel={
                <BasicDataTableDisplay model={periodicModelState}
                     rowClickCallback={
                    (e: any, row: any) => {
                        modelStore.updatePlanetOfReference(row.getData());
                    }}
                    selectedPlanetID={selectedPlanetID}
                    setSelectedPlanetID={setSelectedPlanetID}
                />
            } />
            <Tab id="ng" title="Tab2" panel={
                <DataTable model={periodicModelState}/>
            } />
        </Tabs> : null}
    </div>
    );
}

// export default Display;
export const Display = React.memo(_Display);
export default Display;
