import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../util";
import { useModel } from "../hooks/useModel";

export class ModelStore {

    private readonly isTestTrue$ = new BehaviorSubject(true);

    isTestTrue = () => asBehavior(this.isTestTrue$);
    makeTestTrue = () => this.isTestTrue$.next(true);
    makeTestFalse = () => this.isTestTrue$.next(false);

    private readonly planetCounter$ = new BehaviorSubject(0);
    planetCounter = () => asBehavior(this.planetCounter$);
    updatePlanetCounter = (newNum: number) => this.planetCounter$.next(newNum);


    // private readonly solarModel$ = new BehaviorSubject( useModel );
    // solarModel = () => asBehavior(this.solarModel$);


}

export const modelStore = new ModelStore();
