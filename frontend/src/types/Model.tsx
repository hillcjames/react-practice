import { useCallback, useMemo, useState } from "react";

import { Planetoid } from "../types/Planetoid";
import { Vector2d } from "../types/Vector2d";
import { getAPI } from "../apis/interface";
import { getTime, uuid, getRandomInt } from "../util";


export type Model = {
    state: ModelState;
    dispatcher: SolarModelMethods;
}

export type ModelState = {
    planetoidList: Planetoid[];
}
export type SolarModelMethods = {
    runTick: () => void;
    addPlanetoid: () => void;
    removePlanetoid: (planetoidID: string) => void;
    setPlanetoids: (planetoids: Planetoid[]) => void;
}

// static class
export class ModelController {

    // probably feed in dt here as param, but be mindful of long, long ticks due to some problem or something.
    // Would have very unreal effects.
    public static runTick(model: ModelState) {
        let dt = 1;
        let heaviest: Planetoid | null = null;
        model.planetoidList.forEach((p1: Planetoid) => {
            if (p1.dead) {
                return;
            }
            if (heaviest === null || p1.mass > heaviest.mass) {
                heaviest = p1;
            }
            let totalForce = new Vector2d(0, 0);

            model.planetoidList.forEach((p2: Planetoid) => {
                if (p1.id === p2.id || p2.dead) {
                    return;
                }
                if (ModelController.planetsAreTouching(p1, p2)) {
                    if (p1.mass >= p2.mass) {
                        p2.dead = true;
                        p1.mass += p2.mass;
                        p1.radius += 0.1*p2.radius;
                        p1.rank += p2.rank;
                    }
                }
                let partialF = ModelController.forceBetweenPlanets(p1, p2);
                totalForce.add(partialF);

                // if (model.planetoidList.length > 3) {
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
            p1.prevLocs.push(p1.pos);
        });


        model.planetoidList.forEach((p: Planetoid) => {
            if (heaviest !== null) {
                p.updateFrameOfReference(heaviest.pos);
            }
        });

        // model.planetoidList.forEach((p: Planetoid, index: number) => {
        //     if (p.dead) {
        //         model.planetoidList.splice(index, 1);
        //     }
        // });

        // if (model.planetoidList.length > 3) {
        //
        //     throw new TypeError("test");
        // }
        //
    }

    static planetsAreTouching(p1: Planetoid, p2: Planetoid): boolean {
        let rSum: number = p1.radius + p2.radius;
        return Vector2d.squaredDist(p1.pos, p2.pos) <= rSum * rSum;
    }

    static forceBetweenPlanets(p1: Planetoid, p2: Planetoid): Vector2d {
        // const G = 6.67 * 10e-11; // actual
        const G = 1 * 1e-3;
        let magnitude = G * p1.mass * p2.mass / Math.sqrt(Vector2d.squaredDist(p1.pos, p2.pos));
        let f = Vector2d.unitVectorFromSourceToDest(p1.pos, p2.pos);
        f.scale(magnitude);
        return f;
    }

    public static getRandomPlanet(state: ModelState, screenWidth: number, screenHeight: number): Planetoid {
        let newName = ModelController.getNewName(state.planetoidList.length+1);
        let x = getRandomInt(screenWidth)-screenWidth/2;
        let y = getRandomInt(screenHeight)-screenHeight/2;
        let mass = 1000+getRandomInt(2000);
        let v = Vector2d.VectorFromAngleAndMagnitude(getRandomInt(100)/100, getRandomInt(314)/100);
        console.log(v);
        return new Planetoid(newName, x, y, mass, v.x, v.y)
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

    // public static updatePlanetoid(): Planetoid {
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
    // public static getGasPlanet: () => Planetoid = () => {
    //
    // }
    // public static getSolidPlanet: () => Planetoid = () => {
    //
    // }
    // public static getPlanetoid: () => Planetoid = () => {
    //
    // }
    // public static getSunPlanet: () => Planetoid = () => {
    //     return new Planetoid("Sol", 0, 0, 100, 5);
    // }
    // public static getPlanet: (densityClass: DensityClass) => Planetoid = (densityClass: DensityClass) => {
    //
    //     return new Planetoid("Alph", 0, 0, 100, 5);
    // }
    // static planetFactoryList = [
    //     getGasPlanet
    // ];
}
