import React, { Component, useContext, useEffect, useState } from "react";
import { Button } from "@blueprintjs/core";

import BasicDataTableDisplay from './BasicDataTableDisplay';
import TestComponent from './TestComponent';

import { useToggleable } from "../hooks/useToggleable";
import { useBehavior } from '../hooks/useBehavior';
import { SendRequestButton } from "./SendRequestButton";
import { mainStore } from '../stores/MainStore';
import { modelStore, initialModelState } from '../stores/ModelStore';
import { Model, ModelState } from "../types/Model";
import { Planet } from '../types/Planet';
import { Vector2d } from '../types/Vector2d';

import logo from '../icons/logo.svg';
import '../css/Body.css';
import '../css/ToolPane.css';


export interface ToolPaneProps {
}

const _ToolPane: React.FC<ToolPaneProps> = (props: ToolPaneProps) => {
    const sendRequestButton = useToggleable(true);

    const solarIsVisible = useBehavior(mainStore.isSolarDisplayVisible);

    const isPaused = useBehavior(modelStore.isSimPaused);
    const modelState = useBehavior(modelStore.modelState);
    // const [periodicModelState, setPeriodicModelState] = useState(initialModelState);
    const newSimData = useBehavior(modelStore.newSimData);

    const universeWidth = useBehavior(mainStore.universeWidth);
    const universeHeight = useBehavior(mainStore.universeHeight);
    //
    // useEffect(() => {
    //     // console.log("Updating toolpane")
    //     setPeriodicModelState({...modelState});
    // }, [newSimData]); // Only re-run the effect if count changes


    return (
        <div className="ToolPane">
            {/* <img src={logo} className="Body-logo" alt="logo" /> */}
            <p>
              This is a ToolPane!
            </p>

            {/* <SendRequestButton
                isVisible={sendRequestButton.isVisible}
                isDisabled={false}
                onClick={() => {
                    modelContext.addNewBody();
                    modelContext.value += 1;
                }}
            /> */}
            <Button
                text={"Update modelState via dispatcher"}
                data-element-id="add-planet-button"
                disabled={false}
                onClick={() => {
                    {/* props.model.dispatcher.addPlanet();
                    props.model.dispatcher.addPlanet();
                    props.model.dispatcher.addPlanet(); */}
                    console.log(universeWidth, universeHeight)
                    modelStore.addRandomPlanet(universeWidth, universeHeight);
                    modelStore.addRandomPlanet(universeWidth, universeHeight);
                    modelStore.addRandomPlanet(universeWidth, universeHeight);
                }}
                icon="square"
                minimal
                small
                title={"Update modelState "}
            />

            <Button
                text={" Toggle display"}
                data-element-id="toggle-display-button"
                disabled={false}
                onClick={() => {
                    if (solarIsVisible) {
                        mainStore.hideSolarDisplay();
                    }
                    else {
                        mainStore.showSolarDisplay();
                    }
                }}
                icon="refresh"
                minimal
                small
                title={"Toggle display"}
            />
            <Button
                text={isPaused ? "Run Sim" : "Pause Sim"}
                data-element-id="run-tick-button"
                disabled={false}
                onClick={() => {
                    if (isPaused) {
                        modelStore.runSimulation();
                    }
                    else {
                        modelStore.pauseSimulation();
                    }
                }}
                icon="refresh"
                minimal
                small
                title={isPaused ? "Run Sim" : "Pause Sim"}
            />
            <Button
                text={"Run Test"}
                data-element-id="run-test-button"
                disabled={false}
                onClick={() => {
                    modelStore.updateAll((modelState: ModelState) => {
                        for (let p of modelState.planets) {
                            if (p.name !== "Sol") {
                                p.v.y += 0.3;
                            }
                        }
                    });
                }}
                icon="refresh"
                minimal
                small
                title={"Run Test"}
            />
            <Button
                text={"Add vec"}
                data-element-id="add-vec-button"
                disabled={false}
                onClick={() => {
                    modelStore.addRandomPlanet(universeWidth, universeHeight);
                }}
                icon="refresh"
                minimal
                small
                title={"Add vec"}
            />
            {/* <BasicDataTableDisplay model={periodicModelState}/> */}
        </div>
    );
}

const ToolPane = React.memo(_ToolPane);
export default ToolPane;
