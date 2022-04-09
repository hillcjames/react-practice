import { BehaviorSubject } from "rxjs";
import { asBehavior, BehaviorObservable } from "../util";

import { mainStore } from "./MainStore";
import { ModelState, ModelController } from "../types/Model";
import { Planet, planetFromJSONObject } from '../types/Planet';
import { Vector2d } from '../types/Vector2d';
import { getMilliseconds } from '../util';

export const TailLength = {
    NONE: {name: "NONE", value: 0},
    SHORT: {name: "SHORT", value: 30},
    LONG: {name: "LONG", value: 400}
}


export const initialModelState: ModelState = {
    planets: [],
    // planets: new Map<string, Planet>(),
    history: [],
    maxHistoryLength: TailLength.LONG
}


const fieldSize = 1600;
export class AreaInBounds {
    static xMin: number = -fieldSize/2;
    static yMin: number = -fieldSize/2;
    static xMax: number = fieldSize/2;
    static yMax: number = fieldSize/2;
    static asPoints = () => {
        return [
            new Vector2d(AreaInBounds.xMin, AreaInBounds.yMin),
            new Vector2d(AreaInBounds.xMax, AreaInBounds.yMin),
            new Vector2d(AreaInBounds.xMax, AreaInBounds.yMax),
            new Vector2d(AreaInBounds.xMin, AreaInBounds.yMax),
        ];
    }
}


export class ModelStore {
    private centerFlyweight: Planet = new Planet("fly", 0, 0, 0);
    private sol: Planet;
    private initialPlanetList: Planet[];
    private initialPlanetListJSON: string;
    private testingPlanetList: Planet[];

    constructor() {
        // let initialPlanetList: Planet[] = [
        //     new Planet("Sol", 0, 0, 100000),
        //     new Planet("Alph", -10, 0, 100, 0, 3.8),
        //     new Planet("Bet", -20, 0, 100, 0, 2.9),
        //     new Planet("Gam", -30, 0, 100, 0, 1.5),
        //     new Planet("Delt", -50, 0, 100, 0, 1.25),
        //     new Planet("Eps", -80, 0, 100, 0, 0.85)
        // ];
        //
        // this.sol = new Planet("Sol", 0, 0, 100000);
        this.sol = new Planet("Sol", 0, 0, 100000, 0, -0.04);

        this.initialPlanetList = [
            this.sol,

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
        this.testingPlanetList = [
            new Planet("Sir W", -200, 0, 45000, 1, 0),
            new Planet("Sir Ater", 100, 0, 50000, 0, 0),
        ]
        // this.initialPlanetListJSON = JSON.stringify(this.testingPlanetList);
        this.initialPlanetListJSON = JSON.stringify(this.initialPlanetList);
        this.updatePlanetOfReference(this.centerFlyweight);
    }
    loadPresetSolarSystem = () => {
        mainStore.setSolarDataLoading(true);
        this.loadSolarSystemFromJson(this.initialPlanetListJSON);
        this.updatePlanetOfReference(this.getPlanetByName("Sol") as Planet);
        this.clearHistory();
        mainStore.setSolarDataLoading(false);
    };

    loadSolarSystemFromJson = (jsonPlanetsData: string) => {
        let planetObjects: any[] = JSON.parse(jsonPlanetsData);
        let planets: Planet[] = [] as Planet[];
        for (let obj of planetObjects) {
            let p = planetFromJSONObject(obj);
            if (p) {
                planets.push(p);
            }
        }
        this.setPlanets(planets);
    };

    resetSolarSystem = () => {
        this.setPlanets([]);
        this.updatePlanetOfReference(this.centerFlyweight);
    };

    // loadSolarSystemFromDisk = () => {
    //
    // }

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
    getPlanetByName = (name: string) => {
        return this.modelState$.getValue().planets.find(p => p.name === name);
    }
    addRandomPlanet = (canvasWidth: number, canvasHeight: number) => {
        let p: Planet = ModelController.getRandomPlanet(this.modelState$.getValue(), canvasWidth, canvasHeight);
        return this.addPlanet(p);
    }
    removePlanet = (id: string) => {
        let oldState = this.modelState$.getValue();
        let planets = oldState.planets.filter((p: Planet) => p.id !== id);

        this.pushUpdateFromSim();
        return this.modelState$.next({...oldState, planets: planets});
    }
    clearHistory = () => {
        let state = this.modelState$.getValue();
        return this.modelState$.next({...state, history: []});
    }
    setHistoryLength = (histLength: typeof TailLength.NONE) => {
        let state = this.modelState$.getValue();
        return this.modelState$.next({...state, maxHistoryLength: histLength});
    }


    resetView = () => {
        this.updatePlanetOfReference(this.centerFlyweight);
    }

    runTick = (dt: number) => {
        this.test++;

        let newState = this.modelState$.getValue();
        ModelController.runTick(newState, dt); // should do it in place?

        let planets = this.disposeOfDead(newState.planets);
        if (planets.length !== newState.planets.length) {
            return this.modelState$.next({...newState, planets: planets});
        }
        else {
            return this.modelState$.next(newState);
        }

    }

    disposeOfDead = (planets: Planet[]) => {
        return planets.filter((p: Planet) => !p.dead);
    }


    private readonly isSimPaused$ = new BehaviorSubject(true);
    isSimPaused = () => asBehavior(this.isSimPaused$);
    pauseSimulation = () => this.isSimPaused$.next(true);
    runSimulation = () => this.isSimPaused$.next(false);


    private readonly planetOfReference$ = new BehaviorSubject(this.centerFlyweight);
    planetOfReference = () => asBehavior(this.planetOfReference$);
    updatePlanetOfReference = (planetToFollow: Planet) => this.planetOfReference$.next(planetToFollow);


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


}

export const modelStore = new ModelStore();
