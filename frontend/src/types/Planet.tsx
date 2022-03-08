
import { Vector2d } from "./Vector2d";
import { PlanetStyle, PlanetStyles } from "./PlanetStyle";
import { isValidNumber, uuid } from "../util";

export class Planet {
    id: string;
    name: string;
    // radius: number;
    pos: Vector2d;
    v: Vector2d;
    mass: number;
    style: PlanetStyle;
    debug: string = "";
    rank: number = 1;
    dead: boolean = false;
    prevLocs: Vector2d[] = [];

    constructor(name: string, x: number, y: number, mass: number, vX?: number, vY?: number, style?: PlanetStyle) {
        this.id = uuid();
        this.name = name;
        this.pos = new Vector2d(isValidNumber(x) ? x : 0, isValidNumber(y) ? y : 0);
        this.mass = isValidNumber(mass) ? mass : 100;
        this.v = new Vector2d(isValidNumber(vX) ? vX : 0, isValidNumber(vY) ? vY : 0);
        // this.radius = isValidNumber(radius) ? radius : 5;
        // this.radius = Math.pow(this.mass, 1/4)/3;
        // this.radius = Math.pow(this.mass, 1/4)/3;
        this.style = (style != undefined ? style : PlanetStyles.BLUE);
        this.prevLocs = [this.pos];
        console.log(this.pos, this.mass, this.radius);
    }

    public radius = () : number => {
        return Math.pow(this.mass, 1/3)/8;
    }

    // This must invert the above function.
    static getMassForRadius(radius: number) {
        return Math.pow(radius*8, 3);
    }

    public toString = () : string => {
        return `Planet (id: ${this.id})`;
    }

    public updateFrameOfReference(solPos: Vector2d) {
        this.pos.add(Vector2d.scaled(solPos, -1));

        this.prevLocs.forEach((prevLoc: Vector2d) => {
            prevLoc.add(Vector2d.scaled(solPos, -1));
        });
    }
}


export function isPlanet(obj: any): obj is Planet {
    return obj !== undefined && obj.mass !== undefined;
}

if (typeof Array.isArray === 'undefined') {
    Array.isArray = function(obj): obj is [] {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
};

export function isPlanetList(obj: any): obj is Planet[] {
    if (Array.isArray(obj)) {
        obj.forEach(function(item){
            if(!isPlanet(item)){
                return false;
            }
        });
    }
    else {
        return false;
    }
    return true;
}
