import * as React from "react";

import './css/App.css';
import Header from './components/Header';
import Body from './components/Body';
import {createModel} from './util'

export const ModelContext = React.createContext(createModel())

const _App: React.FC<{}> = () => {
    return (
        <div className="App">
            <Header/>
            <Body/>
        </div>
    );
}

export const App = React.memo(_App);
export default App;
