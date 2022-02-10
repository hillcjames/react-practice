import * as React from "react";

import '../css/Body.css';
import ToolPane from './ToolPane';
import Display from './Display';

import { Model } from '../types/Model';


const _Body: React.FC<{}> = () => {
    return (
    <div className="Body">
        <ToolPane/>
        <Display/>
    </div>
    );
}

export const Body = React.memo(_Body);
export default Body;
