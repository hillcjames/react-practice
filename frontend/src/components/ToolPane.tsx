import React, { Component, useContext, useEffect, useState } from "react";
import { Button } from "@blueprintjs/core";

import { useToggleable } from "../hooks/useToggleable";
import { useBehavior } from '../hooks/useBehavior';
import { useModel } from '../hooks/useModel';
import { SendRequestButton } from "./SendRequestButton";
import { ModelContext } from '../App';
import { mainStore } from '../stores/MainStore';
import { Model } from "../types/Model";
import { modelStore } from '../stores/ModelStore';
import { Planetoid } from '../types/Planetoid';

import logo from '../icons/logo.svg';
import '../css/Body.css';
import '../css/ToolPane.css';


export interface ToolPaneProps {
    model: Model
}

const _ToolPane: React.FC<ToolPaneProps> = (props: ToolPaneProps) => {
    const modelContext = useContext(ModelContext);
    const sendRequestButton = useToggleable(true);

    const [numPlanets, setNumPlanets] = useState(0);

    const planetCounter = useBehavior(modelStore.planetCounter);

    const solarIsVisible = useBehavior(mainStore.isSolarDisplayVisible);

    useEffect(() => {
        console.log("Updating tool!!")
        document.title = `You clicked ${modelContext.value} times`;
    }, [modelContext.value]); // Only re-run the effect if count changes

    return (
        <div className="ToolPane">
            <img src={logo} className="Body-logo" alt="logo" />
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
                text={"Update the global modelContext directly"}
                data-element-id="toggle-display-button"
                disabled={false}
                onClick={() => {
                    modelContext.addNewBody();
                    modelContext.value += 1;
                }}
                icon="square"
                minimal
                small
                title={"Update modelContext "}
            />
            <Button
                text={"Update modelState via dispatcher"}
                data-element-id="toggle-display-button"
                disabled={false}
                onClick={() => {
                    props.model.dispatcher.addPlanetoid(new Planetoid("Test"));
                }}
                icon="square"
                minimal
                small
                title={"Update modelState "}
            />
            <Button
                text={"Basic state hook"}
                data-element-id="toggle-display-button"
                disabled={false}
                onClick={() => {
                    setNumPlanets(numPlanets + 1);
                }}
                icon="trending-up"
                minimal
                small
                title={"Update modelState "}
            />
            <Button
                text={"Check everything " + modelContext.value + " " + numPlanets + " " + props.model.state.numPlanets}
                data-element-id="check-reponse-button"
                disabled={false}
                onClick={() => {
                    console.log("Test");
                    console.log(modelContext.value + " " + numPlanets + " " + solarIsVisible);
                }}
                icon="circle"
                minimal
                small
                title={"Check response " + modelContext.value}
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
        </div>
    );
}

const ToolPane = React.memo(_ToolPane);
export default ToolPane;
