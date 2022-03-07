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
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";

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
        // let initialPlanetList: Planet[] = [
        //     new Planet("Sol", 0, 0, 100000),
        //     new Planet("Alph", -10, 0, 100, 0, 3.8),
        //     new Planet("Bet", -20, 0, 100, 0, 2.9),
        //     new Planet("Gam", -30, 0, 100, 0, 1.5),
        //     new Planet("Delt", -50, 0, 100, 0, 1.25),
        //     new Planet("Eps", -80, 0, 100, 0, 0.85)
        // ];
        let sol: Planet = new Planet("Sol", 0, 0, 100000);
        let initialPlanetList: Planet[] = [
            sol,

            // new Planet("p1", -100, 0, 1000, 0, 1),
            // new Planet("p2", 100, 0, 1000, 0, 1),

            // new Planet("p1", -100, 0, 50000, 0, 0),
            // new Planet("p2", 100, 0, 50000, 0, 0),

            new Planet("Alph", -10, 0, 100, 0, 4),
            new Planet("Bet", -20, 0, 100, 0, 3.2),
            new Planet("Gam", -20, 0, 1000, 0, 2.2),
            new Planet("Delt", -30, 0, 100, 0, 1.5),
            new Planet("Eps", -50, 0, 100, 0, 1.25),
            new Planet("Zeta", -80, 0, 100, 0, 0.85),
            new Planet("Eta", -100, 0, 100, 0, 0.91),
            new Planet("Theta", -133, -5, 100, 0, 0.99),
            new Planet("Iota", -146, 3, 100, 0, 0.87),
            new Planet("Kappa", 170, 0, 500, 0, -0.65),
            new Planet("Endor", 174, 0, 1, 0, -0.97)
        ];
        modelStore.setPlanets(initialPlanetList);
        modelStore.updatePlanetOfReference(sol);
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
