
export class Vector2d {
    x: number;
    y: number;
    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }

    public static VectorFromAngleAndMagnitude(magnitude: number, thetaRadians: number): Vector2d {
        return new Vector2d(magnitude * Math.cos(thetaRadians), magnitude * Math.sin(thetaRadians))
    }

    add(v: Vector2d) {
        this.x += v.x;
        this.y += v.y;
    }

    scale(scale: number) {
        this.x *= scale;
        this.y *= scale;
    }

    piecewiseInverse() {
        let invX = this.x != 0 ? 1/this.x : 0;
        let invY = this.y != 0 ? 1/this.y : 0;
        return new Vector2d(invX, invY);
    }

    copy(): Vector2d {
        return new Vector2d(this.x, this.y);
    }

    public static unitVectorFromSourceToDest(source: Vector2d, dest: Vector2d): Vector2d {
        let magnitude = Vector2d.squaredDist(source, dest);
        if (magnitude === 0) {
            return new Vector2d(0, 0);
        }

        let dist = new Vector2d(dest.x - source.x, dest.y - source.y);
        dist.scale(1/magnitude);

        return dist;
    }

    public static added(v1: Vector2d, v2: Vector2d): Vector2d {
        return new Vector2d(v1.x + v2.x, v1.y + v2.y);
    }

    public static sub(v1: Vector2d, v2: Vector2d): Vector2d {
        return new Vector2d(v1.x - v2.x, v1.y - v2.y);
    }

    public static scaled(v1: Vector2d, scale: number): Vector2d {
        return new Vector2d(v1.x * scale, v1.y * scale);
    }

    public static dotProduct(v1: Vector2d, v2: Vector2d): number {
        return v1.x * v2.x, v1.y * v2.y;
    }

    public static squaredDist(v1: Vector2d, v2: Vector2d): number {
        let xDist = v1.x - v2.x;
        let yDist = v1.y - v2.y;
        return xDist*xDist + yDist*yDist;
    }

    public toString(): string {
        return this.x + " " + this.y;
    }
}
