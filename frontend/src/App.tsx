import React, { Component, useContext, useEffect, useState } from "react";

import Header from './components/Header';
import Body from './components/Body';

import { StateProvider, createModelContext } from "./contexts"

import './css/App.css';


export const ModelContext = createModelContext();


const _App: React.FC<{}> = () => {

    useEffect(() => {
        console.log("Updating App!!")
    });

    return (
        <div className="App">
            <StateProvider>
                <Header/>
                <Body/>
            </StateProvider>
        </div>
    );
}

export const App = React.memo(_App);
export default App;
