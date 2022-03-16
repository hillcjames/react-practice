import React, { Component, useContext, useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import Measure from "react-measure";

import { Planet } from "../types/Planet";
import { Vector2d } from "../types/Vector2d";
import { mainStore } from '../stores/MainStore';
import { modelStore, AreaInBounds } from '../stores/ModelStore';
import { useBehavior } from '../hooks/useBehavior';
import { asTwoDigitStr, getMilliseconds, getRandomInt, mod, safeStringify } from "../util";


import '../css/p5canvas.css';

export interface P5CanvasProps {
    onPlanetClick: (p: Planet) => void
    onPlanetRightClick: (p: Planet) => void
}

const _P5Canvas: React.FC<P5CanvasProps> = (props: P5CanvasProps) =>  {
    const [width, setWidth] = useState(950);
    const [height, setHeight] = useState(801);

    const [stars, setStars] = useState<Vector2d[]>([] as Vector2d[]);

    const [canvas, setCanvas] = useState<any | null>(null);

    const [p5, setP5] = useState<p5Types | null>(null);

    const [clickStartLoc, setClickStartLoc] = useState<Vector2d | null>(null);
    const [clickStartTime, setClickStartTime] = useState<number>(-1);

    const [scale, setScale] = useState<number>(3);

    const modelState = useBehavior(modelStore.modelState);
    const planetOfReference = useBehavior(modelStore.planetOfReference);
    const isSimPaused = useBehavior(modelStore.isSimPaused);
    const showTails = useBehavior(mainStore.showTails);
    const showStars = useBehavior(mainStore.showStars);
    const tailsRelativeToReferencePlanet = useBehavior(mainStore.tailsRelativeToReferencePlanet);


    const [newPlanetDrawingStarted, setNewPlanetDrawingStarted] = useState(false);
    const [shouldPlayAfterRelease, setShouldPlayAfterRelease] = useState(false);


    useEffect(() => {
        console.log("Re-rendering canvas (This shouldn't happen after startup)");
        for (let i = 0; i < 50; i++) {
            stars.push( new Vector2d(getRandomInt(2000), getRandomInt(2000)) );
        }
    }, []);


    useEffect(() => {
        if (newPlanetDrawingStarted) {
            modelStore.pauseSimulation();
            setShouldPlayAfterRelease(!isSimPaused);
        }
        else if (shouldPlayAfterRelease){
            modelStore.runSimulation();
        }
    }, [newPlanetDrawingStarted]);


    const setup = (_p5: p5Types, canvasParentRef: Element) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        setP5(_p5);
        let _canvas = _p5.createCanvas(width, height).parent(canvasParentRef);
        setCanvas(_canvas);

        canvasParentRef.addEventListener('contextmenu', function(e) {
              e.preventDefault();
            }, false);
    };


    function getOffset(referencePos: Vector2d): Vector2d {
        return new Vector2d(width/2 - referencePos.x * scale, height/2 - referencePos.y * scale)
    }

    const render = (p5: p5Types) => {
        p5.background(0);
        p5.stroke(255);

        // doesn't work - why?
        // let neutralOffset = getOffset(new Vector2d(width/2,height/2));
        // if (planetOfReference && !planetOfReference.dead) {
        //     neutralOffset = getOffset(planetOfReference.pos);
        // }
        let neutralOffset = getOffset(planetOfReference.pos);

        // Instead of making each planet keep track of its 100 previous points,
        // just save in system state the last hundred positions of all elements.
        // Just an array of <string ID, position vecotr>maps
        // Same amount of data, but that way.. I think you can print the tails from the perpective of whichever planet you want?
        // And it should update immediately?
        // It'll have to be.. This planets the center, so five frames ago draw this other planet's tail segment using whatever offset would have been present then.
        // Whatever it is, the current reference point's tail should always be zero.
        //
        // That's what you need the moving background for.
        //

        // Pick a random number, say 17. Plot white dots where pixel % 17 is 0 ?
        // No. start somewhere on screen, plot 100 points at random intervals % screen size.

        if (showStars) {
            p5.strokeWeight(1);
            let frequency = 80;
            for (let star of stars) {
                if (getRandomInt(frequency) === 1) {
                    star.x += 0.5;
                }
                if (getRandomInt(frequency) === 1) {
                    star.y += 0.5;
                }

                let x = mod(star.x + neutralOffset.x, width);
                let y = mod(star.y + neutralOffset.y, height);

                p5.point(x, y);
            }
        }


        if (showTails) {
            // let prevHistorySlice = modelState.history[0];
            let prevHistorySlice = null;
            for (let i = 0; i < modelState.history.length; i++) {


                let historySlice = modelState.history[i];
                let refPlanetPosThisSlice = historySlice.get(planetOfReference.id);
                // console.log(planetOfReference.name, !refPlanetPosThisSlice)
                if (!refPlanetPosThisSlice) {
                    refPlanetPosThisSlice = neutralOffset;
                }

                let offsetThisSlice = getOffset(refPlanetPosThisSlice);

                if (!tailsRelativeToReferencePlanet) {
                    offsetThisSlice = neutralOffset;
                }

                for (let [planetID, pos] of Array.from(historySlice.entries())) {
                    // TODO change planets to a map
                    let planet = modelState.planets.find(p => p.id ===planetID);
                    if (!planet) {
                        continue;
                    }
                    let maxTrailWidth = planet.radius()*scale*0.6;
                    let trailScalingFactor = (modelState.history.length - i)/modelState.history.length;
                    trailScalingFactor*=trailScalingFactor;
                    trailScalingFactor*=trailScalingFactor;
                    trailScalingFactor*=trailScalingFactor;
                    p5.strokeWeight(0.1 + maxTrailWidth*trailScalingFactor);
                    // let pos = historySlice.get(planetID);
                    // for (const [planetID, pos] of historySlice.entries()) {
                    let p1 = null;
                    if (prevHistorySlice) {
                        p1 = prevHistorySlice.get(planetID); // same planet, just last frame.
                    }
                    else {
                        p1 = planet.pos;
                    }
                    // console.log(p1, pos, (!p1 || ! pos));
                    if (!p1 || ! pos) {
                        break;
                    }
                    let p2 = pos;
                    p5.line(p1.x*scale + offsetThisSlice.x, p1.y*scale + offsetThisSlice.y, p2.x*scale + offsetThisSlice.x, p2.y*scale + offsetThisSlice.y);

                }
                // if (modelState.history.length > 99) {
                //     console.log( "HERE", historySlice.size);
                //     throw new Error();
                // }
                prevHistorySlice = historySlice;
            }

        }

        if (clickStartLoc) {
            p5.fill(20,180,70)
            let endX = clickStartLoc.x + 0.5*(clickStartLoc.x - p5.mouseX);
            let endY = clickStartLoc.y + 0.5*(clickStartLoc.y - p5.mouseY);
            p5.strokeWeight(1);
            p5.line(clickStartLoc.x, clickStartLoc.y, endX, endY);
            let r = getRadiusFromTime(getMilliseconds() - clickStartTime);
            p5.strokeWeight(0);
            p5.ellipse(clickStartLoc.x, clickStartLoc.y, r, r);
            p5.fill(255);
            p5.stroke(255)
        }


        p5.strokeWeight(5);
        let boundsArea = AreaInBounds.asPoints();
        for (let i = 0; i < boundsArea.length; i++) {
            p5.line(boundsArea[i].x * scale + neutralOffset.x, boundsArea[i].y * scale + neutralOffset.y,
                boundsArea[(i+1)%boundsArea.length].x * scale + neutralOffset.x, boundsArea[(i+1)%boundsArea.length].y * scale + neutralOffset.y);
        }


        for (let planet of modelState.planets) {
            // ctx.fillStyle = '#000000';
            if (planet.dead) {
                p5.fill(60,10,10)
            }
            else {
                p5.fill(255);
            }
            p5.strokeWeight(1);
            p5.ellipse(planet.pos.x*scale + neutralOffset.x, planet.pos.y*scale + neutralOffset.y, planet.radius()*scale, planet.radius()*scale);
        }
        p5.fill(255);



        // p5.fill(128);
        // p5.ellipse(offset.x, offset.y, 4, 4);
    }



// https://gafferongames.com/post/fix_your_timestep/
    // let t: number = 0.0;
    const dt: number = 10;
    const physicsSpeed: number = useBehavior(modelStore.physicsSpeed);

    let currentTime: number = getMilliseconds();
    let accumulator: number = 0;

    let generalUpdateAccumulator = 0;

    const draw = (p5: p5Types) => {
        let newTime = getMilliseconds();
        let frameTime = newTime - currentTime;
        currentTime = newTime;

        accumulator += frameTime;
        generalUpdateAccumulator += frameTime;

        while ( accumulator >= dt ) {
            // integrate( state, t, dt );
            if (!isSimPaused) {
                modelStore.runTick(dt * physicsSpeed);
            }
            accumulator -= dt;
            // t += dt;
        }
        if (!isSimPaused && generalUpdateAccumulator > 1000) {
            modelStore.pushUpdateFromSim();
            generalUpdateAccumulator = 0;
        }

        render(p5);
    };


    const getRadiusFromTime = (timeMouseButtonHeld: number) => {
        const maxWidth = 15;
        const deltaRate = 0.01;
        return 1+Math.abs(Math.floor(deltaRate*timeMouseButtonHeld+maxWidth) % (2*maxWidth) - maxWidth);
    }


    const onMousePress = (event: any) => {
        let mousePos = new Vector2d(event.mouseX, event.mouseY);

        setClickStartLoc(null);
        setClickStartTime(-1);
        let offset = getOffset(planetOfReference.pos);

        // if ((mousePos.x < offset.x - width/2 || mousePos.x > offset.x + width/2)
        //     || (mousePos.y < offset.y - height/2 || mousePos.y > offset.y + height/2)) {
        //     setClickStartLoc(null);
        //     setClickStartTime(-1);
        //     return false;
        // }

        let closest: Planet | null = null;
        let bestSqrDist: number = 1000000000000000;
        for (let planet of modelState.planets) {
            if (planet.dead) {
                continue;
            }
            let pos = new Vector2d(planet.pos.x*scale + offset.x, planet.pos.y*scale + offset.y);
            // console.log(pos, planet.radius()*scale);
            let sqrDist = Vector2d.squaredDist(pos, mousePos);
            if (sqrDist < bestSqrDist) {
                bestSqrDist = sqrDist;
                closest = planet;
            }
        }

        // what if planet is very wide? Take into account radius.
        if (!closest || (closest && bestSqrDist > (closest.radius()+20)*(closest.radius()+20))) {

            if (event.mouseButton === "right") {
                setNewPlanetDrawingStarted(true);
                setClickStartLoc(mousePos);
                setClickStartTime(getMilliseconds());
                return false;
            }
        }
        else {
            if (event.mouseButton === "right") {
                props.onPlanetRightClick(closest);
                return false;
            }
            else {
                props.onPlanetClick(closest);
                return false;
            }
        }

        return false;
    }

    const onMouseRelease = (event: any) => {
        // create a planet at current loc
        if (!clickStartLoc) {
            return false;
        }

        let endX = clickStartLoc.x + 0.5*(clickStartLoc.x - event.mouseX);
        let endY = clickStartLoc.y + 0.5*(clickStartLoc.y - event.mouseY);
        let onScreenDist: Vector2d = new Vector2d(endX - clickStartLoc.x, endY - clickStartLoc.y);
        let v: Vector2d = Vector2d.scaled(onScreenDist, 0.01);

        let neutralOffset = getOffset(planetOfReference.pos);
        let r = getRadiusFromTime(getMilliseconds() - clickStartTime)/scale;
        let p = new Planet("Bob", (clickStartLoc.x - neutralOffset.x)/scale, (clickStartLoc.y - neutralOffset.y)/scale, Planet.getMassForRadius(r), v.x, v.y);
        modelStore.addPlanet(p);
        // p5.ellipse(planet.pos.x*scale + neutralOffset.x, planet.pos.y*scale + neutralOffset.y, planet.radius()*scale, planet.radius()*scale);


        setNewPlanetDrawingStarted(false);
        setClickStartLoc(null);
        setClickStartTime(-1);
        return false;
    }


    const onMouseWheel = (event: any) => {
        let delta = 0;
        // All of these should exist, looking at the documentation and source code, and yet for some reason here on linux firefox, only the last one does.
        if (event.delta) {
            delta = event.delta;
        }
        else if (event.deltaY) {
            delta = event.deltaY;
        }
        else if (event._mouseWheelDeltaY) {
            delta = event._mouseWheelDeltaY;
        }
        // console.log(typeof onMouseWheel)
        // console.log(event.delta);
        // console.log(event.deltaY);
        // console.log(event._mouseWheelDeltaY); // Why
        // console.log(safeStringify(event));
        // let newScale = scale + (-1*delta)/800; // for clarity.
        let newScale = scale + (-1*delta)/800; // for clarity.
        if (delta > 0) {
            newScale = scale * 0.9;
        }
        else {
            newScale = scale * 1.1;
        }
        if (newScale > 0.5 && newScale < 50) {
            setScale(newScale);
        }
    }


    return (
            <Measure
                bounds
                onResize={(contentRect) => {
                    // if (contentRect.bounds && this.state.dimensions.width !== contentRect.bounds.width) {
                    if (contentRect.bounds) {

                        let eitherUpdated: boolean = false;
                        if (contentRect.bounds.width > 0 && contentRect.bounds.width !== width) {
                            // if content bounds are different
                            setWidth(contentRect.bounds.width);
                            mainStore.updateUniverseWidth(width/scale);
                            eitherUpdated = true;
                        }

                        if (contentRect.bounds.height > 0 && contentRect.bounds.height !== height) {
                            // if content bounds are different
                            setHeight(contentRect.bounds.height);
                            mainStore.updateUniverseHeight(height/scale);
                            eitherUpdated = true;
                        }

                        if (eitherUpdated) {
                            console.log("Trying to update new canvas  ", width, height);
                            if (isP5Types(p5) && width !== 0 && height !== 0) {
                                console.log("Updating new canvas  ", width, height);
                                p5.resizeCanvas(width, height);
                            }
                        }
                        console.log("Updating measured canvas bounds:  ", contentRect.bounds);
                    }
                }}
            >
                {({ measureRef }) => (
                    <div className="p5canvas_div_wrapper" ref={measureRef}>
                        <Sketch className="p5canvas" setup={setup} draw={draw}
                            mousePressed={onMousePress}
                            mouseReleased={onMouseRelease}
                            mouseWheel={onMouseWheel}/>
                    </div>
                )}
            </Measure>
    );
};

function isP5Types(obj: any): obj is p5Types {
    return obj !== undefined && obj !== null && obj.resizeCanvas !== undefined;
}

const P5Canvas = React.memo(_P5Canvas);
export default P5Canvas;
