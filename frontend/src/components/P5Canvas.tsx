import React, { Component, useContext, useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import Measure from "react-measure";

import { Planet } from "../types/Planet";
import { ModelState } from "../types/Model";
import { Vector2d } from "../types/Vector2d";
import { mainStore } from '../stores/MainStore';
import { modelStore } from '../stores/ModelStore';
import { useBehavior } from '../hooks/useBehavior';
import { asTwoDigitStr, getMilliseconds, getRandomInt, mod } from "../util";


import '../css/p5canvas.css';

export interface P5CanvasProps {
    onPlanetClick: (p: Planet | null) => void
    onPlanetRightClick: (p: Planet | null) => void
}

const _P5Canvas: React.FC<P5CanvasProps> = (props: P5CanvasProps) =>  {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const divRef = useRef<HTMLDivElement | null>(null);

    let x = 50;
    let y = 50;
    const [height, setHeight] = useState(1101);
    const [width, setWidth] = useState(1200);

    const [stars, setStars] = useState<Vector2d[]>([] as Vector2d[]);

    const [p5, setP5] = useState<p5Types | null>(null);

    const [clickStartLoc, setClickStartLoc] = useState<Vector2d | null>(null);
    const [clickStartTime, setClickStartTime] = useState<number>(-1);
    const [clickEnd, setClickEnd] = useState<Vector2d | null>(null);

    let scale = 3;

    const modelState = useBehavior(modelStore.modelState);
    const planetOfReference = useBehavior(modelStore.planetOfReference);
    const isSimPaused = useBehavior(modelStore.isSimPaused);
    const showTails = useBehavior(mainStore.showTails);
    const showStars = useBehavior(mainStore.showStars);
    const tailsRelativeToReferencePlanet = useBehavior(mainStore.tailsRelativeToReferencePlanet);


    // const [rawClick, setRawClick] = useState<Vector2d>(new Vector2d(0,0));

    // useEffect(() => {
    //     const resizeObserver = new ResizeObserver((event) => {
    //         // Depending on the layout, you may need to swap inlineSize with blockSize
    //         // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
    //         setWidth(event[0].contentBoxSize[0].inlineSize);
    //         setHeight(event[0].contentBoxSize[0].blockSize);
    //         // if (isP5Types(p5) && width !== 0 && height !== 0) {
    //         //     p5.resizeCanvas(width, height);
    //         // }
    //     });
    //     if (canvasRef) {
    //         resizeObserver.observe(canvasRef);
    //     }
    // });
    // useEffect( () => {
    //         // The 'current' property contains info of the reference:
    //         // align, title, ... , width, height, etc.
    //         if(divRef != null && divRef.current && divRef.current.offsetWidth > 0 && divRef.current.offsetHeight > 0){
    //             setWidth(divRef.current.offsetWidth);
    //             setHeight(divRef.current.offsetHeight);
    //             mainStore.updateUniverseWidth(width/scale);
    //             mainStore.updateUniverseHeight(height/scale);
    //             modelStore.updatePlanetOfReference(new Vector2d(width/2, height/2));
    //             console.log("Updating new canvas  ", width, height);
    //             if (isP5Types(p5) && width !== 0 && height !== 0) {
    //                 p5.resizeCanvas(width, height);
    //             }
    //         }
    //
    //     }, [divRef]);
    useEffect(() => {
        console.log("Re-rendering canvas (This shouldn't happen after startup)");
        for (let i = 0; i < 50; i++) {
            stars.push( new Vector2d(getRandomInt(2000), getRandomInt(2000)) );
        }
    }, []);


    const setup = (_p5: p5Types, canvasParentRef: Element) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        setP5(_p5);
        let canvas = _p5.createCanvas(width, height).parent(canvasParentRef);

        canvasParentRef.addEventListener('contextmenu', function(e) {
              e.preventDefault();
            }, false);
    };


    // const divRef = useCallback(node => {
    //     // if (node !== null) {
    //     //     let w = node.getBoundingClientRect().width;
    //     //     let h = node.getBoundingClientRect().height;
    //     //     console.log(w, h, node.getBoundingClientRect());
    //     //     if (w !== 0 && h !== 0) {
    //     //         setWidth(w);
    //     //         setHeight(h);
    //     //         if (isP5Types(p5) && width !== 0 && height !== 0) {
    //     //             p5.resizeCanvas(width, height);
    //     //         }
    //     //     }
    //     // }
    // }, []);


    function getOffset(referencePos: Vector2d): Vector2d {
        return new Vector2d(width/2 - referencePos.x * scale, height/2 - referencePos.y * scale)
    }

    const render = (p5: p5Types) => {
        p5.background(0);
        p5.stroke(255);

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


        for (let planet of modelState.planets) {
            // ctx.fillStyle = '#000000';
            if (!planet.dead) {
                p5.strokeWeight(1);
                p5.ellipse(planet.pos.x*scale + neutralOffset.x, planet.pos.y*scale + neutralOffset.y, planet.radius()*scale, planet.radius()*scale);
            }
        }

        // p5.rect(rawClick.x, rawClick.y, 10, 10);

        if (showTails) {
            let prevHistorySlice = modelState.history[1];
            for (let i = 2; i < modelState.history.length; i++) {


                let historySlice = modelState.history[i];
                let refPlanetPosThisSlice = historySlice.get(planetOfReference.id);
                if (!refPlanetPosThisSlice) {
                    continue;
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
                    let trailScalingFactor = i/modelState.history.length;
                    trailScalingFactor*=trailScalingFactor;
                    trailScalingFactor*=trailScalingFactor;
                    trailScalingFactor*=trailScalingFactor;
                    p5.strokeWeight(0.1 + maxTrailWidth*trailScalingFactor);
                    // let pos = historySlice.get(planetID);
                    // for (const [planetID, pos] of historySlice.entries()) {
                    let p1 = prevHistorySlice.get(planetID); // same planet, just last frame.
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
            p5.strokeWeight(1);
            let endX = clickStartLoc.x + 0.5*(clickStartLoc.x - p5.mouseX);
            let endY = clickStartLoc.y + 0.5*(clickStartLoc.y - p5.mouseY);
            p5.line(clickStartLoc.x, clickStartLoc.y, endX, endY);
            let r = getRadiusFromTime(getMilliseconds() - clickStartTime);
            p5.ellipse(clickStartLoc.x, clickStartLoc.y, r, r);
        }

        // if (modelState.history.length > 99) {
        //     throw new Error();
        // }

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
            props.onPlanetClick(null);

            if (event.mouseButton === "right") {

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

        setClickStartLoc(null);
        setClickStartTime(-1);
        return false;
    }


    return (
            <Measure
                bounds
                onResize={(contentRect) => {
                    {/* if (contentRect.bounds && this.state.dimensions.width !== contentRect.bounds.width) { */}
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
                        <Sketch className="p5canvas" setup={setup} draw={draw} mousePressed={onMousePress} mouseReleased={onMouseRelease}/>
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
