import React, { Component, useContext, useEffect, useState } from "react";

import Header from './components/Header';
import Body from './components/Body';

import { useBehavior } from './hooks/useBehavior';
import { ModelState, Model } from "./types/Model";
import { Planet } from "./types/Planet";
import { mainStore } from './stores/MainStore';
import { modelStore } from './stores/ModelStore';
import { StateProvider, createModelContext } from "./contexts"
import { delay } from "./util";

import './css/App.css';

//https://medium.com/monstar-lab-bangladesh-engineering/deploying-node-js-apps-in-amazon-linux-with-pm2-7fc3ef5897bb


export const ModelContext = createModelContext();


const _App: React.FC<{}> = () => {

    // const [solarModelState, dispatcher] = useModel();
    // const model: Model = {
    //     state: solarModelState,
    //     dispatcher: dispatcher
    // }

    // useEffect(() => {
    //     temp();
    // }, [isSimPaused]);
    //
    // const temp: ()=>void = () => {
    //     console.log("Are we paused? " + isSimPaused)
    //     // if (!isSimPaused) {
    //     if (solarModelState.planets.length < 6) {
    //         // dispatcher.runTick();
    //         dispatcher.addPlanet();
    //         delay(3000).then(() => {
    //             temp();
    //         });
    //     }
    // };
    //

    const [initialize, setInitialize] = useState(false);

    useEffect(() => {
        mainStore.setSolarDataLoading(true);
        let initialPlanetList: Planet[] = [
            new Planet("Sol", 0, 0, 100000),
            new Planet("Alph", -10, 0, 100, 0, 3.8),
            new Planet("Bet", -20, 0, 100, 0, 2.9),
            new Planet("Gam", -30, 0, 100, 0, 1.5),
            new Planet("Delt", -50, 0, 100, 0, 1.25),
            new Planet("Eps", -80, 0, 100, 0, 0.85)
        ];
        modelStore.setPlanets(initialPlanetList);
        // dispatcher.setPlanets(initialPlanetList);
        mainStore.setSolarDataLoading(false);
        // mainStore.setSolarDataLoading(true);
        // loadFromBackend().then((data) => {
        //     if parseData(data) is valid
        //         setPlanetList(validPlanetData);
        //         mainStore.setSolarDataLoadFailure(false);
        //     else:
        //         mainStore.setSolarDataLoadFailure(true);
        //
        //     mainStore.setSolarDataLoading(false);
        // });
    }, [initialize]);

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
