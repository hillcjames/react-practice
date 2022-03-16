// import { useCallback, useMemo, useState } from "react";

import { modelStore, AreaInBounds } from '../stores/ModelStore';
import { Planet } from "../types/Planet";
import { Vector2d } from "../types/Vector2d";
// import { getAPI } from "../apis/interface";
import { getTime, getRandomInt } from "../util";



export type ModelState = {
    planets: Planet[];
    // planets: Map<string, Planet>;
    history: Map<string, Vector2d>[];
}

// static class
export class ModelController {

    // probably feed in dt here as param, but be mindful of long, long ticks due to some problem or something.
    // Would have very unreal effects.
    public static runTick(model: ModelState, dt: number) {
        // let heaviest: Planet | null = null;
        let somethingDiedThisTick = false;

        // The problem is, the planets always update in the same order. That means if planet p1 and p2 are moving towards each other,
        // p1 will move first, and then p2. So the force p2 feels will always be slightly stronger than the force p1 feels.

        let planetPosDeltas: Map<string, Vector2d> = new Map <string, Vector2d>();

        let newSliceOfHistory = new Map<string, Vector2d>();


        model.planets.forEach((p1: Planet) => {
            if (p1.dead) {
                return;
            }
            // if (heaviest === null || p1.mass > heaviest.mass) {
            //     heaviest = p1;
            // }

            let totalForce = new Vector2d(0, 0);

            model.planets.forEach((p2: Planet) => {
                if ((p1.id === p2.id) || p2.dead || p1.dead) {
                    return;
                }
                if (ModelController.planetsAreTouching(p1, p2)) {
                    let somethingDiedRightNow = ModelController.handlePlanetCollision(p1, p2);
                    if (!somethingDiedThisTick) {
                        somethingDiedThisTick = somethingDiedRightNow;
                    }
                }
                if (p1.dead || p2.dead) {
                    return;
                }
                let partialF = ModelController.forceBetweenPlanets(p1, p2);

                totalForce.add(partialF);
            });
            // if this planet died this frame
            if (p1.dead) {
                return;
            }

            // dx = v0*t + 1/2*a*t^2
            // console.log(p1.id + " " + totalForce + " " + p1.v);
            // console.log("\t\t" + Vector2d.scaled(p1.v, dt));
            // console.log("\t\t" + Vector2d.scaled(totalForce, (dt*dt)/2));
            // let deltaPos = Vector2d.added( Vector2d.scaled(p1.v, dt),
            //                             Vector2d.scaled(totalForce, (dt*dt)/2));
            let a = Vector2d.scaled(totalForce, 1/p1.mass);
            let deltaV = Vector2d.scaled(a, dt);
            p1.v.add(deltaV);
            let deltaPos = Vector2d.scaled(p1.v, dt);

            //see above note for planetPosDeltas
            planetPosDeltas.set(p1.id, deltaPos);

            newSliceOfHistory.set(p1.id, p1.pos.copy());
        });

        // model.history.push(newSliceOfHistory);
        model.history = [newSliceOfHistory].concat(model.history);
        let maxLength = 500;
        if (model.history.length > maxLength) {
            model.history.splice(maxLength-1, maxLength);
        }



        model.planets.forEach((p: Planet) => {
            if (planetPosDeltas.has(p.id)) {
                p.pos.add(planetPosDeltas.get(p.id) as Vector2d);
                if (p.pos.x < AreaInBounds.xMin || p.pos.x > AreaInBounds.xMax || p.pos.y < AreaInBounds.yMin || p.pos.y > AreaInBounds.yMax) {
                    // console.log(p.pos.x)
                    modelStore.removePlanet(p.id);
                    p.dead = true;
                }
            }
        });

        if (somethingDiedThisTick) {
            modelStore.pushUpdateFromSim();
        }



        // model.planets.forEach((p: Planet) => {
        //     if (model.centerPos !== null) {
        //         p.updateFrameOfReference(model.centerPos);
        //     }
        // });

    }

    static handlePlanetCollision(p1: Planet, p2: Planet): boolean {
        if (p1.dead || p2.dead) {
            return false;
        }
        let survivor = p1.mass > p2.mass ? p1 : p2;
        let casualty = p1.mass > p2.mass ? p2 : p1;

        let momentumSurvivor = Vector2d.scaled(survivor.v, survivor.mass);
        let momentumCasualty = Vector2d.scaled(casualty.v, casualty.mass);
        console.log(survivor.v, casualty.v);
        console.log(momentumSurvivor, momentumCasualty);

        momentumSurvivor.add(momentumCasualty);
        survivor.v = Vector2d.scaled(momentumSurvivor, 1/(survivor.mass + casualty.mass));
        console.log("   ", momentumSurvivor, survivor.v);

        casualty.dead = true;
        survivor.mass += casualty.mass;
        survivor.rank += casualty.rank;
        // modelStore.removePlanet(casualty.id);


        return true;
    }

    static planetsAreTouching(p1: Planet, p2: Planet): boolean {
        let rSum: number = p1.radius() + p2.radius();
        rSum /= 2;
        return Vector2d.squaredDist(p1.pos, p2.pos) <= rSum * rSum;
    }

    static forceBetweenPlanets(p1: Planet, p2: Planet): Vector2d {
        // const G = 6.67 * 10e-11; // actual
        const G = 1 * 1e-3;
        let rSqrd = Vector2d.squaredDist(p1.pos, p2.pos);
        let magnitude = G * p1.mass * p2.mass / rSqrd;
        let cutoffR = (p1.radius() + p2.radius())/10;
        if (rSqrd === 0 || rSqrd < cutoffR*cutoffR) {
            magnitude = 0;
        }
        let f = Vector2d.unitVectorFromSourceToDest(p1.pos, p2.pos);
        f.scale(magnitude);
        return f;
    }

    public static getRandomPlanet(modelState: ModelState, screenWidth: number, screenHeight: number): Planet {
        let newName = ModelController.getNewName(modelState.planets.length+1);
        let x = getRandomInt(screenWidth)-screenWidth/2;
        let y = getRandomInt(screenHeight)-screenHeight/2;
        let mass = 100+getRandomInt(800);
        let v = Vector2d.VectorFromAngleAndMagnitude(getRandomInt(500)/100, getRandomInt(314)/100);
        return new Planet(newName, x, y, mass, v.x, v.y)
    }

    public static getNewName(planetNum: number): string {
        let name = "";
        while (planetNum > 0) {
            let charNum = planetNum % 26;
            name += String.fromCharCode(96+charNum);
            planetNum -= charNum;
            planetNum /= 26;
        }
        return name;
    }

    // public static updatePlanet(): Planet {
    //
    // }
}

// static class
export class SolarFactory {
    // static DensityClass = {
    //     GAS: 0.001, // 1g/cm^3
    //     SOLID: 0.005, // 5g/cm^3
    // }
    //
    // public static getGasPlanet: () => Planet = () => {
    //
    // }
    // public static getSolidPlanet: () => Planet = () => {
    //
    // }
    // public static getPlanet: () => Planet = () => {
    //
    // }
    // public static getSunPlanet: () => Planet = () => {
    //     return new Planet("Sol", 0, 0, 100, 5);
    // }
    // public static getPlanet: (densityClass: DensityClass) => Planet = (densityClass: DensityClass) => {
    //
    //     return new Planet("Alph", 0, 0, 100, 5);
    // }
    // static planetFactoryList = [
    //     getGasPlanet
    // ];
}
