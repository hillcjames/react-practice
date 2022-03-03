import { BehaviorSubject } from "rxjs";
import { asBehavior, BehaviorObservable } from "../util";

import { ModelState, ModelController } from "../types/Model";
import { Planet } from '../types/Planet';
import { Vector2d } from '../types/Vector2d';
import { getMilliseconds } from '../util';

export const initialModelState: ModelState = {
    planets: []
}

export class ModelStore {

    private test: number = 0;

    private readonly modelState$ = new BehaviorSubject<ModelState>(initialModelState);
    modelState: () => BehaviorObservable<ModelState> = () => asBehavior(this.modelState$);

    lastPushedUpdate = getMilliseconds() - 10000;

    updateAll = (update: (modelState: ModelState) => void) => {
        let newState = this.modelState$.getValue();
        update(newState);
        return this.modelState$.next({...newState});
    }
    setPlanets = (planets: Planet[]) => {
        let prevState = this.modelState$.getValue();
        this.pushUpdateFromSim();
        return this.modelState$.next({...prevState, planets: planets});
    }
    addPlanet = (p: Planet) => {
        let newState = this.modelState$.getValue();
        newState.planets.push(p);
        this.pushUpdateFromSim();
        return this.modelState$.next({...newState});
    }
    addRandomPlanet = (canvasWidth: number, canvasHeight: number) => {
        let p: Planet = ModelController.getRandomPlanet(this.modelState$.getValue(), canvasWidth, canvasHeight);
        return this.addPlanet(p);
    }
    removePlanet = (id: string) => {
        let newState = this.modelState$.getValue();

        newState.planets.forEach((p: Planet, index: number) => {
            if (p.id === id) {
                newState.planets.slice(index, 1);
            }
        });
        this.pushUpdateFromSim();
        return this.modelState$.next({...newState});
    }
    //
    // setCenterPos = (pos: Vector2d) => {
    //     let prevState = this.modelState$.getValue();
    //     return this.modelState$.next({...prevState, centerPos: pos});
    // }

    runTick = (dt: number) => {
        this.test++;

        let newState = this.modelState$.getValue();
        ModelController.runTick(newState, dt); // should do it in place?

        return this.modelState$.next(newState);
    }


    private readonly isSimPaused$ = new BehaviorSubject(true);
    isSimPaused = () => asBehavior(this.isSimPaused$);
    pauseSimulation = () => this.isSimPaused$.next(true);
    runSimulation = () => this.isSimPaused$.next(false);


    private readonly centerPointOfRef$ = new BehaviorSubject(new Vector2d(0, 0));
    centerPointOfRef = () => asBehavior(this.centerPointOfRef$);
    updateCenterPointOfRef = (newPoint: Vector2d) => this.centerPointOfRef$.next(newPoint);


    private readonly newSimData$ = new BehaviorSubject(true);
    newSimData = () => asBehavior(this.newSimData$);
    pushUpdateFromSim = () => {
        // console.log("Pushing update");
        let currentTime = getMilliseconds();
        if (currentTime - this.lastPushedUpdate < 500) {
            return this.newSimData$;
        }
        this.lastPushedUpdate = currentTime;
        return this.newSimData$.next(!this.newSimData$.getValue());
    };

    private readonly physicsSpeed$ = new BehaviorSubject( 0.04 );
    physicsSpeed = () => asBehavior(this.physicsSpeed$);
    setPhysicsSpeed = (newSpeed: number) => {
        if (newSpeed > 0.2 || newSpeed < 0.01) {
            return this.physicsSpeed$;
        }
        return this.physicsSpeed$.next(newSpeed);
    }

    private readonly showTails$ = new BehaviorSubject(false);
    showTails = () => asBehavior(this.showTails$);
    toggleShowTails = () => this.showTails$.next(!this.showTails$.getValue());

}

export const modelStore = new ModelStore();
