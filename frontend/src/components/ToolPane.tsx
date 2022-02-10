import React, { Component, useContext } from "react";
import { Button } from "@blueprintjs/core";

import { useToggleable } from "../hooks/useToggleable";
import { Model } from "../types/Model";
import { SendRequestButton } from "./SendRequestButton";
import { ModelContext } from '../App';

import logo from '../icons/logo.svg';
import '../css/Body.css';
import '../css/ToolPane.css';


export interface ToolPaneProps {
}

const _ToolPane: React.FC<ToolPaneProps> = (props: ToolPaneProps) => {
    const modelContext = useContext(ModelContext);
    const sendRequestButton = useToggleable(true);
    return (
        <div className="ToolPane">
            <img src={logo} className="Body-logo" alt="logo" />
            <p>
              This is a ToolPane!
            </p>

            <SendRequestButton
                isVisible={sendRequestButton.isVisible}
                isDisabled={false}
                onClick={() => {
                    modelContext.addNewBody();
                }}
            />
            <Button
                data-element-id="check-reponse-button"
                disabled={false}
                onClick={() => {
                    console.log("Test");
                    console.log(modelContext.value);
                }}
                icon="circle"
                minimal
                small
                title={"Check response2"}
            />
        </div>
    );
}

const ToolPane = React.memo(_ToolPane);
export default ToolPane;
