import { useCallback, useMemo, useState } from "react";

import { modelStore } from '../stores/ModelStore';
import { Planet } from "../types/Planet";
import { Vector2d } from "../types/Vector2d";
import { getAPI } from "../apis/interface";
import { getTime, uuid, getRandomInt } from "../util";


export type Model = {
    state: ModelState;
    dispatcher: SolarModelMethods;
}

export type ModelState = {
    planets: Planet[];
}

export type SolarModelMethods = {
    runTick: () => void;
    addPlanet: () => void;
    removePlanet: (planetID: string) => void;
    setPlanets: (planets: Planet[]) => void;
}

// static class
export class ModelController {

    // probably feed in dt here as param, but be mindful of long, long ticks due to some problem or something.
    // Would have very unreal effects.
    public static runTick(model: ModelState, dt: number) {
        // let heaviest: Planet | null = null;
        let somethingDied = false;

        model.planets.forEach((p1: Planet) => {
            if (p1.dead) {
                return;
            }
            // if (heaviest === null || p1.mass > heaviest.mass) {
            //     heaviest = p1;
            // }

            let totalForce = new Vector2d(0, 0);

            model.planets.forEach((p2: Planet) => {
                if ((p1.id === p2.id) || p2.dead) {
                    return;
                }
                if (ModelController.planetsAreTouching(p1, p2)) {
                    if (p1.mass >= p2.mass) {
                        somethingDied = true;
                        p2.dead = true;
                        p1.mass += p2.mass;
                        // p1.radius += 0.1*p2.radius;
                        p1.rank += p2.rank;
                    }
                }
                let partialF = ModelController.forceBetweenPlanets(p1, p2);

                // if (isNaN(totalForce.x) || isNaN(totalForce.y)) {
                //     throw new Error("temp");
                //     return;
                // }
                // if (p1.name !== "Sol") {
                    totalForce.add(partialF);
                // }

                // if (model.planets.length > 3) {
                //     console.log(p1.id + " " + p2.id + " " + totalForce + " " + partialF);
                // }
            });
            p1.debug = totalForce.toString();

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
            p1.pos.add(deltaPos);
            p1.prevLocs.push(p1.pos.copy());
            if (p1.prevLocs.length > 100) {
                p1.prevLocs.splice(0, 1);
            }
        });

        if (somethingDied) {
            modelStore.pushUpdateFromSim();
        }


        // model.planets.forEach((p: Planet) => {
        //     if (model.centerPos !== null) {
        //         p.updateFrameOfReference(model.centerPos);
        //     }
        // });

    }

    static planetsAreTouching(p1: Planet, p2: Planet): boolean {
        let rSum: number = p1.radius() + p2.radius();
        rSum /= 2;
        return Vector2d.squaredDist(p1.pos, p2.pos) <= rSum * rSum;
    }

    static forceBetweenPlanets(p1: Planet, p2: Planet): Vector2d {
        // const G = 6.67 * 10e-11; // actual
        const G = 1 * 1e-3;
        let r  = Math.sqrt(Vector2d.squaredDist(p1.pos, p2.pos));
        let magnitude = G * p1.mass * p2.mass / r;
        if (r === 0 || r < (p1.radius() + p2.radius())/10) {
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
