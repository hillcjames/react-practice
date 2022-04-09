import React, { Component, useContext, useEffect, useState } from "react";
import { Button, Intent, Radio, RadioGroup, Switch } from "@blueprintjs/core";

// import TestComponent from './TestComponent';
import ToolPaneButton from './ToolPaneButton';

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
    const showStars = useBehavior(mainStore.showStars);

    const tailsRelativeToReferencePlanet = useBehavior(mainStore.tailsRelativeToReferencePlanet);


    return (
        <div className="ToolPane">

            <ToolPaneButton
                text={isPaused ? "Run Sim" : "Pause Sim"}
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
                text={"Reset"}
                onClick={() => {
                    modelStore.loadPresetSolarSystem();
                }}
            />
            <ToolPaneButton
                text={"Clear Solar System"}
                onClick={() => {
                    modelStore.resetSolarSystem();
                }}
            />

            <ToolPaneButton
                text={"Add new planet"}
                disabled={false}
                onClick={() => {
                    modelStore.addRandomPlanet(universeWidth, universeHeight);
                }}
                icon="plus"
            />

            <ToolPaneButton
                text={"Reset Viewing Area"}
                onClick={() => {
                    modelStore.resetView();
                }}
                icon="reset"
            />




            <Switch label="Show Stars" checked={showStars} onChange={mainStore.toggleShowStars} />
            <RadioGroup
                label="Show trails"
                name="group"
                onChange={handleStringChange((value: any) => {
                    console.log(value);
                    switch(value) {
                        case TailLength.NONE.name:
                            modelStore.setHistoryLength(TailLength.NONE);
                            modelStore.clearHistory();
                            break;
                        case TailLength.SHORT.name:
                            modelStore.setHistoryLength(TailLength.SHORT);
                            break;
                        case TailLength.LONG.name:
                            modelStore.setHistoryLength(TailLength.LONG);
                            break;
                    }
                    // mainStore.handleTailLengthChange(value);
                })}
                selectedValue={modelState.maxHistoryLength.name}
            >
                <Radio label={TailLength.NONE.name} value={TailLength.NONE.name} />
                <Radio label={TailLength.SHORT.name} value={TailLength.SHORT.name} />
                <Radio label={TailLength.LONG.name} value={TailLength.LONG.name} />
            </RadioGroup>

            <Switch label={tailsRelativeToReferencePlanet ? "Center is reference frame" : "Stars are reference frame"}
                // disabled={!tailLength}
                checked={tailsRelativeToReferencePlanet} onChange={() => {
                    if (tailsRelativeToReferencePlanet) {
                        mainStore.setTailsRelativeTostars();
                    }
                    else {
                        mainStore.setTailsRelativeToReferencePlanet();
                    }
            }} />

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
