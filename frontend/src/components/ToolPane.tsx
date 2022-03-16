import React, { Component, useContext, useEffect, useState } from "react";
import { Button, Intent, Switch } from "@blueprintjs/core";

// import TestComponent from './TestComponent';
import ToolBarButton from './ToolBarButton';

import { useToggleable } from "../hooks/useToggleable";
import { useBehavior } from '../hooks/useBehavior';
// import { SendRequestButton } from "./SendRequestButton";
import { mainStore, Displays } from '../stores/MainStore';
import { modelStore } from '../stores/ModelStore';
import { ModelState } from "../types/Model";

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

    const showTails = useBehavior(mainStore.showTails);
    const showStars = useBehavior(mainStore.showStars);

    const tailsRelativeToReferencePlanet = useBehavior(mainStore.tailsRelativeToReferencePlanet);


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
                text={"Reset Viewing Area"}
                data-element-id="reset-view-button"
                disabled={false}
                onClick={() => {
                    modelStore.resetView();
                }}
                icon="reset"
                minimal
                small
                intent={Intent.WARNING}
                title={"Reset Viewing Area"}
            />
            <ToolBarButton
                text={"Load Preset"}
                onClick={() => {
                    modelStore.loadPresetSolarSystem();
                }}
            />
            <ToolBarButton
                text={"Clear Solar System"}
                onClick={() => {
                    modelStore.resetSolarSystem();
                }}
            />

            <ToolBarButton
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
            <ToolBarButton
                text={"Add -Y velocity"}
                onClick={() => {
                    modelStore.updateAll((modelState: ModelState) => {
                        for (let p of modelState.planets) {
                            if (p.name !== "Sol") {
                                p.v.y += 0.3;
                            }
                        }
                    });
                }}
                icon="arrow-down"
            />
            <ToolBarButton
                text={"Add new planet"}
                disabled={false}
                onClick={() => {
                    modelStore.addRandomPlanet(universeWidth, universeHeight);
                }}
                icon="plus"
            />

            <Switch label="Show Stars" checked={showStars} onChange={mainStore.toggleShowStars} />
            <Switch label="Show trails" checked={showTails} onChange={mainStore.toggleShowTails} />
            <Switch label={tailsRelativeToReferencePlanet ? "Center is reference frame" : "Stars are reference frame"}
                disabled={!showTails}
                checked={tailsRelativeToReferencePlanet} onChange={() => {
                    if (tailsRelativeToReferencePlanet) {
                        mainStore.setTailsRelativeTostars();
                    }
                    else {
                        mainStore.setTailsRelativeToReferencePlanet();
                    }
            }} />

            {/* <ToolBarButton
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
