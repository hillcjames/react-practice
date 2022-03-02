import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useState } from "react";
import { timer } from 'rxjs';

import { Planet, isPlanet, isPlanetList } from "../types/Planet";
import { Vector2d } from "../types/Vector2d";
import { ModelState, ModelController, SolarModelMethods, SolarFactory } from "../types/Model";
import { getAPI } from "../apis/interface";
import { getTime, getRandomInt } from "../util";

import { mainStore } from '../stores/MainStore';
import { modelStore } from '../stores/ModelStore';
import { useBehavior } from '../hooks/useBehavior';



//
// export function useModel(): [ModelState, SolarModelMethods] {
//
//     const canvasWidth = useBehavior(mainStore.canvasWidth);
//     const canvasHeight = useBehavior(mainStore.canvasHeight);
//
//
//     const [initialize, setInitialize] = useState(false);
//
//
//     type ActionType = {type: string, param?: Planet | string | Planet[]};
//
//     const actionTypes = {
//         RUN_TICK: 'RUN_TICK',
//         ADD_PLANETOID: 'ADD_PLANETOID',
//         REMOVE_PLANETOID: 'REMOVE_PLANETOID',
//         SET_PLANETOIDS: 'SET_PLANETOIDS'
//     };
//
//     useLayoutEffect(() => {
//         mainStore.setSolarDataLoading(true);
//         let initialPlanetList: Planet[] = [
//             new Planet("Sol", 0, 0, 100000),
//             new Planet("Alph", -10, 0, 100, 0, 3.8),
//             new Planet("Bet", -20, 0, 100, 0, 2.9),
//             new Planet("Gam", -30, 0, 100, 0, 1.5),
//             new Planet("Delt", -50, 0, 100, 0, 1.25),
//             new Planet("Eps", -80, 0, 100, 0, 0.85)
//         ];
//         for (let p of initialPlanetList) {
//             modelStore.addPlanet(p);
//         }
//         // dispatcher.setPlanets(initialPlanetList);
//         mainStore.setSolarDataLoading(false);
//         // mainStore.setSolarDataLoading(true);
//         // loadFromBackend().then((data) => {
//         //     if parseData(data) is valid
//         //         setPlanetList(validPlanetData);
//         //         mainStore.setSolarDataLoadFailure(false);
//         //     else:
//         //         mainStore.setSolarDataLoadFailure(true);
//         //
//         //     mainStore.setSolarDataLoading(false);
//         // });
//     }, [initialize]);
//
//     // const unlike = () => {
//     //     dispatch({ type: actions.LOADING });
//     //     api.unlike(id)
//     //       .then(() => dispatch({ type: actions.UNLIKED }))
//     //       .catch(error => dispatch({ type: actions.ERROR }, error));
//     //   };
//
//
//
//
//     // This only works if you're returning a whole new state object on every update, not just changing some value in it.
//     const solarReducer = (state: ModelState, action: ActionType) => {
//         switch (action.type) {
//             case actionTypes.RUN_TICK:
//                 ModelController.runTick(state);
//                 // dispatcher.setPlanets(state.planets);
//                 // return state;
//                 return {planets: [...state.planets]};
//                 // return {planets: [...state.planets]};
//             case actionTypes.ADD_PLANETOID:
//                 let newPlanet: Planet = isPlanet(action.param) ? action.param : ModelController.getRandomPlanet(state.planets, canvasWidth, canvasHeight);
//
//                 return {planets: [...state.planets, newPlanet]};
//             case actionTypes.SET_PLANETOIDS:
//                 // let newPlanets: Planet[] = isPlanetList(action.param) ? action.param : [];
//                 let newPlanets: Planet[] = [];
//                 if (action.param !== undefined && isPlanetList(action.param)) {
//                     action.param.forEach(function(item){
//                         if(isPlanet(item)){
//                             newPlanets.push(item);
//                         }
//                     });
//                 }
//                 return {planets: newPlanets};
//             case actionTypes.REMOVE_PLANETOID:
//
//                 state.planets.forEach((p: Planet, index: number) => {
//                     if (p.dead) {
//                         state.planets.splice(index, 1);
//                     }
//                 });
//                 return {planets: [...state.planets]};
//             default:
//                 return state;
//         }
//     }
//
//
//     const [modelState, dispatch] = useReducer(solarReducer, initialModelState);
//
//
//
//
//     const dispatcher: SolarModelMethods = {
//         runTick: () => {
//             dispatch({ type: actionTypes.RUN_TICK });
//         },
//         addPlanet: (newPlanet?: Planet) => {;
//             dispatch({ type: actionTypes.ADD_PLANETOID, param: newPlanet });
//         },
//         removePlanet: (planetID: string) => {
//             dispatch({ type: actionTypes.REMOVE_PLANETOID, param: planetID });
//         },
//         setPlanets: (planets: Planet[]) => {
//             dispatch({ type: actionTypes.SET_PLANETOIDS, param: planets });
//         }
//
//     }
//
//     return [modelState, dispatcher];
// }




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
// solarSystem: Planet[];
// value: string;
//
// addNewBody() {
//     // solarSystem = getAPI().getPlanets();
//     console.log("HAMR1 ");
//     getAPI().getPlanets().then( (response) => {
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
