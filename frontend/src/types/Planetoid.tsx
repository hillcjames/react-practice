
import { Vector2d } from "./Vector2d";
import { PlanetoidStyle, PlanetoidStyles } from "./PlanetoidStyle";

export class Planetoid {
    id: String;
    radius: number;
    pos: Vector2d;
    v: Vector2d;
    mass: number;
    style: PlanetoidStyle;

    constructor(_id: string, x: number, y: number) {
        this.id = _id;
        this.radius = 1000;
        this.pos = new Vector2d(x, y);
        this.v = new Vector2d(0, 0);
        this.mass = 1000;
        this.style = PlanetoidStyles.BLUE;
    }


    public toString = () : string => {
        return `Planetoid (id: ${this.id})`;
    }
}


export function isPlanetoid(obj: any): obj is Planetoid {
    return obj.mass !== undefined
}
