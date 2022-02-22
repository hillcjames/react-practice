import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useState } from "react";
import { timer } from 'rxjs';

import { Planetoid, isPlanetoid, isPlanetoidList } from "../types/Planetoid";
import { ModelState, ModelController, SolarModelMethods, SolarFactory } from "../types/Model";
import { getAPI } from "../apis/interface";
import { getTime, getRandomInt } from "../util";

import { mainStore } from '../stores/MainStore';
import { useBehavior } from '../hooks/useBehavior';


const initialModelState: ModelState = {
    planetoidList: []
}

export function useModel(): [ModelState, SolarModelMethods] {

    const canvasWidth = useBehavior(mainStore.canvasWidth);
    const canvasHeight = useBehavior(mainStore.canvasHeight);


    const [initialize, setInitialize] = useState(false);


    type ActionType = {type: string, param?: Planetoid | string | Planetoid[]};

    const actionTypes = {
        RUN_TICK: 'RUN_TICK',
        ADD_PLANETOID: 'ADD_PLANETOID',
        REMOVE_PLANETOID: 'REMOVE_PLANETOID',
        SET_PLANETOIDS: 'SET_PLANETOIDS'
    };

    useLayoutEffect(() => {
        mainStore.setSolarDataLoading(true);
        let initialPlanetList: Planetoid[] = [
            new Planetoid("Sol", 0, 0, 100000),
            new Planetoid("Alph", -10, 0, 100, 0, 3.8),
            new Planetoid("Bet", -20, 0, 100, 0, 2.9),
            new Planetoid("Gam", -30, 0, 100, 0, 1.5),
            new Planetoid("Delt", -50, 0, 100, 0, 1.25),
            new Planetoid("Eps", -80, 0, 100, 0, 0.85)
        ];
        solarModelMethods.setPlanetoids(initialPlanetList);
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

    // const unlike = () => {
    //     dispatch({ type: actions.LOADING });
    //     api.unlike(id)
    //       .then(() => dispatch({ type: actions.UNLIKED }))
    //       .catch(error => dispatch({ type: actions.ERROR }, error));
    //   };




    // This only works if you're returning a whole new state object on every update, not just changing some value in it.
    const solarReducer = (state: ModelState, action: ActionType) => {
        switch (action.type) {
            case actionTypes.RUN_TICK:
                ModelController.runTick(state);
                // solarModelMethods.setPlanetoids(state.planetoidList);
                // return state;
                return {planetoidList: state.planetoidList};
                // return {planetoidList: [...state.planetoidList]};
            case actionTypes.ADD_PLANETOID:
                let newPlanetoid: Planetoid = isPlanetoid(action.param) ? action.param : ModelController.getRandomPlanet(state, canvasWidth, canvasHeight);

                return {planetoidList: [...state.planetoidList, newPlanetoid]};
            case actionTypes.SET_PLANETOIDS:
                // let newPlanetoids: Planetoid[] = isPlanetoidList(action.param) ? action.param : [];
                let newPlanetoids: Planetoid[] = [];
                if (action.param !== undefined && isPlanetoidList(action.param)) {
                    action.param.forEach(function(item){
                        if(isPlanetoid(item)){
                            newPlanetoids.push(item);
                        }
                    });
                }
                return {planetoidList: newPlanetoids};
            default:
                return state;
        }
    }


    const [modelState, dispatch] = useReducer(solarReducer, initialModelState);




    const solarModelMethods: SolarModelMethods = {
        runTick: () => {
            dispatch({ type: actionTypes.RUN_TICK });
        },
        addPlanetoid: (newPlanetoid?: Planetoid) => {;
            dispatch({ type: actionTypes.ADD_PLANETOID, param: newPlanetoid });
        },
        removePlanetoid: (planetoidID: string) => {
            dispatch({ type: actionTypes.REMOVE_PLANETOID, param: planetoidID });
        },
        setPlanetoids: (planetoids: Planetoid[]) => {
            dispatch({ type: actionTypes.SET_PLANETOIDS, param: planetoids });
        }

    }

    return [modelState, solarModelMethods];
}




//
// export function useModel(initialValue: boolean): Model {
//     const [lastUpdate, setLastUpdate] = useState(getTime);
//
//     // const show = useCallback(() => setIsVisible(true), []);
//     // const hide = useCallback(() => setIsVisible(false), []);
//     // const toggle = useCallback(() => setIsVisible(!isVisible), [isVisible]);
//
//     const addNewBody = useCallback(() => {
//     }, [])
//
//     return useMemo(
//         () => ({
//             lastUpdate,
//             solarSystem,
//             addNewBody,
//             update
//         }),
//         [lastUpdate, solarSystem, addNewBody, update]
//     );
// }





//
// constructor() {
//     this.lastUpdate = getTime();
//     this.solarSystem = [];
//     this.value = "";
// }
//
// lastUpdate: Date;
// solarSystem: Planetoid[];
// value: string;
//
// addNewBody() {
//     // solarSystem = getAPI().getPlanetoids();
//     console.log("HAMR1 ");
//     getAPI().getPlanetoids().then( (response) => {
//         console.log("HAMR2 " + JSON.stringify(response.data) );
//         if (!response.data) {
//             console.log("HAMR No data");
//             return;
//         }
//         if (!response.data.data) {
//             console.log("HAMR Bad data");
//             return;
//         }
//         this.value = response.data.data;
//     });
// }
//
// update(deltaT: number) {
//
// }
