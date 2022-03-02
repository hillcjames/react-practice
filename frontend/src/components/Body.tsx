import React, { Component, useContext, useEffect, useState } from "react";

import '../css/Body.css';
import ToolPane from './ToolPane';
import Display from './Display';
import { ModelState, Model } from "../types/Model";
import { modelStore } from '../stores/ModelStore';


export interface BodyProps {
}

const _Body: React.FC<BodyProps> = (props) => {


    return (
    <div className="Body">
        <ToolPane />
        <Display />
    </div>
    );
}

export const Body = React.memo(_Body);
export default Body;
