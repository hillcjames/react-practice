
import { Vector2d } from "./Vector2d";
import { PlanetoidStyle } from "./PlanetoidStyle";

export interface Planetoid {
    id: String;
    radius: number;
    pos: Vector2d;
    v: Vector2d;
    mass: number;
    style: PlanetoidStyle;
}
