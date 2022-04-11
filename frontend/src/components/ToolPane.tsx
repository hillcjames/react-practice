import React, { Component, useContext, useEffect, useState } from "react";
import { Button, Intent, Radio, RadioGroup, Switch } from "@blueprintjs/core";

// import TestComponent from './TestComponent';
import ToolPaneButton from './ToolPaneButton';

import { OptionsMenuButton } from "./OptionsMenuButton";
import { useToggleable } from "../hooks/useToggleable";
import { useBehavior } from '../hooks/useBehavior';
// import { SendRequestButton } from "./SendRequestButton";
import { mainStore, Displays } from '../stores/MainStore';
import { modelStore, TailLength } from '../stores/ModelStore';
import { ModelState } from "../types/Model";
import { handleStringChange } from "../util";


import '../css/Body.css';
import '../css/ToolPane.css';


export interface ToolPaneProps {
}

const _ToolPane: React.FC<ToolPaneProps> = (props: ToolPaneProps) => {
    // const sendRequestButton = useToggleable(true);

    const currentDisplay = useBehavior(mainStore.currentDisplay);

    const isPaused = useBehavior(modelStore.isSimPaused);

    const universeWidth = useBehavior(mainStore.universeWidth);
    const universeHeight = useBehavior(mainStore.universeHeight);

    const modelState = useBehavior(modelStore.modelState);

    const optionsMenuIsOpen = useBehavior(mainStore.optionsMenuIsOpen);

    //
    // const dims?? = useState(dims??);

    return (
        <div className="ToolPane">

            <ToolPaneButton
                // text={isPaused ? "Run Sim" : "Pause Sim"}
                disabled={false}
                onClick={() => {
                    if (isPaused) {
                        modelStore.runSimulation();
                    }
                    else {
                        modelStore.pauseSimulation();
                    }
                }}
                icon={isPaused ? "play" : "pause"}
            />


            <ToolPaneButton
                // text={"Load"}
                onClick={() => {
                    modelStore.loadPresetSolarSystem();
                }}
                icon={"reset"}
            />
            <ToolPaneButton
                text={"Clear"}
                onClick={() => {
                    modelStore.resetSolarSystem();
                }}
            />

            <ToolPaneButton
                // text={""}
                disabled={false}
                onClick={() => {
                    modelStore.addRandomPlanet(universeWidth, universeHeight);
                }}
                icon="plus"
            />

            {/*
            <ToolPaneButton
                text={"+?"}
                disabled={false}
                onClick={() => {
                    modelStore.addRandomPlanet(universeWidth, universeHeight);
                }}
                // icon="question"
            />
            */}

            <ToolPaneButton
                // text={"Recenter View"}
                onClick={() => {
                    modelStore.resetView();
                }}
                icon="zoom-to-fit"
            />

            <div
                className="optionButton"
                >
                <OptionsMenuButton
                    modelState={modelState}
                />
            </div>

            {/* <ToolPaneButton
                text={currentDisplay === Displays.SOLAR ? "Show Data Table" : "Show Solar Sim"}
                disabled={false}
                onClick={() => {
                    if (currentDisplay === Displays.SOLAR) {
                        mainStore.showDataDisplay();
                    }
                    else {
                        mainStore.showSolarDisplay();
                    }
                }}
            /> */}
        </div>
    );
}

const ToolPane = React.memo(_ToolPane);
export default ToolPane;
