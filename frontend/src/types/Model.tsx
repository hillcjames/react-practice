import { useCallback, useMemo, useState } from "react";

import { Planetoid } from "../types/Planetoid";
import { getAPI } from "../apis/interface";
import { getTime } from "../util";

//
// function isModelState(obj: any): obj is ModelState {
//   return obj.numPlanets !== undefined
// }
export type Model = {
    state: ModelState;
    dispatcher: SolarModelMethods;
}

export type ModelState = {
    numPlanets: number;
    planetList: Planetoid[];
}
export type SolarModelMethods = {
    runTick: () => void;
    addPlanetoid: () => void;
    removePlanetoid: (planetoidID: string) => void;
    getPlanetoid: (planetoidID: string) => void;
    getPlanetoids: () => void;
}


// static class
export class ModelRunner {

}


// export function useModel(initialValue: boolean): Model {
//     constructor() {
//         this.lastUpdate = getTime();
//         this.solarSystem = [];
//         this.value = "";
//     }
//
//     lastUpdate: Date;
//     solarSystem: Planetoid[];
//     value: string;
//
//     addNewBody() {
//         // solarSystem = getAPI().getPlanetoids();
//         console.log("HAMR1 ");
//         getAPI().getPlanetoids().then( (response) => {
//             console.log("HAMR2 " + JSON.stringify(response.data) );
//             if (!response.data) {
//                 console.log("HAMR No data");
//                 return;
//             }
//             if (!response.data.data) {
//                 console.log("HAMR Bad data");
//                 return;
//             }
//             this.value = response.data.data;
//         });
//     }
//
//     update(deltaT: number) {
//
//     }
//
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
