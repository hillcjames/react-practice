import { useCallback, useMemo, useReducer, useState } from "react";

import { Planetoid } from "../types/Planetoid";
import { ModelState, SolarModelMethods } from "../types/Model";
import { getAPI } from "../apis/interface";
import { getTime } from "../util";


const initialModelState: ModelState = {
    numPlanets: 0,
    planetList: []
}

export function useModel(): [ModelState, SolarModelMethods] {
    const actionTypes = {
        RUN_TICK: 'RUN_TICK',
        ADD_PLANETOID: 'ADD_PLANETOID',
        REMOVE_PLANETOID: 'REMOVE_PLANETOID',
        GET_PLANETOID: 'GET_PLANETOID',
        GET_PLANETOIDS: 'GET_PLANETOIDS'
    };

    type ActionType = {type: string, param?: Planetoid | string}

    // setMyArray(oldArray => [...oldArray, newElement]);


    // This only works if you're returning a whole new state object on every update, not just changing some value in it.
    const solarReducer = (state: ModelState, action: ActionType) => {
        switch (action.type) {
            case actionTypes.RUN_TICK:
                // return [...state, {
                //     text: action.param,
                //     completed: false
                // }];
                return state;
            case actionTypes.ADD_PLANETOID:
                // console.log("We here, before: " + action.param + " " + numPlanets + " " + state.numPlanets);
                return {...state, numPlanets: state.numPlanets+1};
            default:
                return state;
        }
    }



    // const unlike = () => {
    //     dispatch({ type: actions.LOADING });
    //     api.unlike(id)
    //       .then(() => dispatch({ type: actions.UNLIKED }))
    //       .catch(error => dispatch({ type: actions.ERROR }, error));
    //   };

    const [modelState, dispatch] = useReducer(solarReducer, initialModelState);

    const solarModelMethods: SolarModelMethods = {
        runTick: () => {
            dispatch({ type: actionTypes.RUN_TICK });
        },
        addPlanetoid: (newPlanetoid: Planetoid) => {
            dispatch({ type: actionTypes.ADD_PLANETOID, param: newPlanetoid });
        },
        removePlanetoid: (planetoidID: string) => {
            dispatch({ type: actionTypes.REMOVE_PLANETOID, param: planetoidID });
        },
        getPlanetoid: (planetoidID: string) => {
            dispatch({ type: actionTypes.GET_PLANETOID, param: planetoidID });
        },
        getPlanetoids: () => {
            dispatch({ type: actionTypes.GET_PLANETOIDS });
        }

    }

    return [modelState, solarModelMethods];
    // return [numPlanets, {numPlanets: numPlanets, planetList: []}, solarModelMethods];
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
