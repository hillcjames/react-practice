import * as React from "react";

import logo from '../icons/logo.svg';
import '../css/Body.css';
import '../css/Display.css';
import TestDisplay from './TestDisplay'
import SolarSystemDisplay from './SolarSystemDisplay'
import { Model } from '../types/Model';


export interface DisplayProps {
}

const _Display: React.FC<DisplayProps> = (props: DisplayProps) => {
    return (
    <div className="Display">
        {/* <TestDisplay/> */}
        <SolarSystemDisplay/>
    </div>
    );
}

// export default Display;
export const Display = React.memo(_Display);
export default Display;
