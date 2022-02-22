
import { Vector2d } from "./Vector2d";
import { PlanetoidStyle, PlanetoidStyles } from "./PlanetoidStyle";
import { isValidNumber, uuid } from "../util";

export class Planetoid {
    id: String;
    name: String;
    radius: number;
    pos: Vector2d;
    v: Vector2d;
    mass: number;
    style: PlanetoidStyle;
    debug: string = "";
    rank: number = 1;
    dead: boolean = false;
    prevLocs: Vector2d[] = [];

    constructor(name: string, x: number, y: number, mass: number, vX?: number, vY?: number, style?: PlanetoidStyle) {
        this.id = uuid();
        this.name = name;
        this.pos = new Vector2d(isValidNumber(x) ? x : 0, isValidNumber(y) ? y : 0);
        this.mass = isValidNumber(mass) ? mass : 100;
        this.v = new Vector2d(isValidNumber(vX) ? vX : 0, isValidNumber(vY) ? vY : 0);
        // this.radius = isValidNumber(radius) ? radius : 5;
        this.radius = Math.pow(this.mass, 1/4)/3;
        this.style = (style != undefined ? style : PlanetoidStyles.BLUE);
        this.prevLocs = [this.pos];
    }


    public toString = () : string => {
        return `Planetoid (id: ${this.id})`;
    }

    public updateFrameOfReference(solPos: Vector2d) {
        this.pos.add(Vector2d.scaled(solPos, -1));

        this.prevLocs.forEach((prevLoc: Vector2d) => {
            prevLoc.add(Vector2d.scaled(solPos, -1));
        });
    }
}


export function isPlanetoid(obj: any): obj is Planetoid {
    return obj !== undefined && obj.mass !== undefined;
}

if (typeof Array.isArray === 'undefined') {
    Array.isArray = function(obj): obj is [] {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
};

export function isPlanetoidList(obj: any): obj is Planetoid[] {
    if (Array.isArray(obj)) {
        obj.forEach(function(item){
            if(!isPlanetoid(item)){
                return false;
            }
        });
    }
    else {
        return false;
    }
    return true;
}
