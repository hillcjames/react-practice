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


    const solarIsVisible = useBehavior(mainStore.isSolarDisplayVisible);

    useEffect(() => {
        console.log("Updating tool!!")
        document.title = `You clicked ${modelContext.value} times`;
    }, [modelContext.value]); // Only re-run the effect if count changes

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
                data-element-id="toggle-display-button"
                disabled={false}
                onClick={() => {
                    props.model.dispatcher.addPlanetoid();
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
        </div>
    );
}

const ToolPane = React.memo(_ToolPane);
export default ToolPane;
