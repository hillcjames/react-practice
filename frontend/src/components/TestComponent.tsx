import React, { Component, useContext, useEffect, useState } from "react";

import '../css/Body.css';
import { ModelState, Model } from "../types/Model";
import { modelStore } from '../stores/ModelStore';


export interface TestComponentProps {
    model: ModelState
}

const _TestComponent: React.FC<TestComponentProps> = (props) => {

    const [msg, setMsg] = useState("Heya");

    useEffect(() => {
        console.log("Updating _TestComponent useEffect ");
        for (let p of props.model.planets) {
            if (p.name === "Bet") {
                let currentV = p.v.toString();
                console.log(currentV)
                setMsg(currentV)
            }
        }
    });


    return (
    <div className="TestComponent">
        {msg}
    </div>
    );
}

export const TestComponent = React.memo(_TestComponent);
export default TestComponent;
