import React, { Component, useContext, useEffect, useState } from "react";

import '../css/Body.css';
import ToolPane from './ToolPane';
import Display from './Display';
import { useModel } from "../hooks/useModel";
import { ModelState, Model } from "../types/Model";
import { modelStore } from '../stores/ModelStore';


const _Body: React.FC<{}> = () => {
    
    const [solarModelState, solarModel] = useModel();
    const model: Model = {
        state: solarModelState,
        dispatcher: solarModel
    }

    useEffect(() => {
        console.log("Updating Body!!")
    });

    return (
    <div className="Body">
        <ToolPane model={model} />
        <Display model={model} />
    </div>
    );
}

export const Body = React.memo(_Body);
export default Body;
