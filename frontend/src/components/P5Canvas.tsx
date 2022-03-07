import React, { Component, useContext, useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import Measure from "react-measure";

import { ModelState } from "../types/Model";
import { Vector2d } from "../types/Vector2d";
import { mainStore } from '../stores/MainStore';
import { modelStore } from '../stores/ModelStore';
import { useBehavior } from '../hooks/useBehavior';
import { asTwoDigitStr, getMilliseconds, getRandomInt, mod } from "../util";


import '../css/p5canvas.css';

export interface P5CanvasProps {
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

    let scale = 3;

    const modelState = useBehavior(modelStore.modelState);
    const planetOfReference = useBehavior(modelStore.planetOfReference);
    const isSimPaused = useBehavior(modelStore.isSimPaused);
    const showTails = useBehavior(modelStore.showTails);



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

        let offset = getOffset(planetOfReference.pos);

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

        let frequency = 80;
        for (let star of stars) {
            if (getRandomInt(frequency) === 1) {
                star.x += 0.5;
            }
            if (getRandomInt(frequency) === 1) {
                star.y += 0.5;
            }

            let x = mod(star.x + offset.x, width);
            let y = mod(star.y + offset.y, height);
            // if (getRandomInt(frequency) === 1) {
            //     x += 0.5;
            // }
            // if (getRandomInt(frequency) === 1) {
            //     y += 0.5;
            // }
            p5.point(x, y);
            // console.log(x, y)
            // p5.rect(x, y, 10, 10);
            // p5.ellipse(planet.pos.x*scale + offset.x, planet.pos.y*scale + offset.y, planet.radius()*scale, planet.radius()*scale);
        }

        // p5.tint(0, 153, 204);
        // p5.ellipse(x, props.model.state.planets.length*20, 70, 70);
        // // p5.ellipse(x, y, 70, 70);
        // // NOTE: Do not use setState in the draw function or in functions that are executed
        // // in the draw function...
        // // please use normal variables or class properties for these purposes
        // x++;
        // if (x > 500) {
        //     x = 400;
        //     // props.model.dispatcher.addPlanet();
        // }
        // console.log(planetOfReference)
        for (let planet of modelState.planets) {
            // ctx.fillStyle = '#000000';
            if (!planet.dead) {
                // if (showTails) {
                //     let maxTrailWidth = planet.radius()*scale*0.6;
                //     for (let i = 2; i < planet.prevLocs.length; i++) {
                //         let trailScalingFactor = i/planet.prevLocs.length;
                //         trailScalingFactor*=trailScalingFactor;
                //         trailScalingFactor*=trailScalingFactor;
                //         trailScalingFactor*=trailScalingFactor;
                //         p5.strokeWeight(0.15 + maxTrailWidth*trailScalingFactor);
                //
                //         let p1 = planet.prevLocs[i-1];
                //         let p2 = planet.prevLocs[i];
                //         let prevR = planet.radius() > 10 ? planet.radius()/10 : 1;
                //         // p5.ellipse(prvLoc.x*scale + offset.x, prvLoc.y*scale + offset.y, prevR*scale, prevR*scale);
                //         p5.line(p1.x*scale + offset.x, p1.y*scale + offset.y, p2.x*scale + offset.x, p2.y*scale + offset.y,);
                //     }
                // }

                p5.strokeWeight(1);
                p5.ellipse(planet.pos.x*scale + offset.x, planet.pos.y*scale + offset.y, planet.radius()*scale, planet.radius()*scale);
            }
        }


        if (showTails) {
            let prevHistorySlice = modelState.history[1];
            for (let i = 2; i < modelState.history.length; i++) {


                let historySlice = modelState.history[i];
                let refPlanetPosThisSlice = historySlice.get(planetOfReference.id);
                if (!refPlanetPosThisSlice) {
                    continue;
                }
                let offsetThisSlice = getOffset(refPlanetPosThisSlice);


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
                    p5.line(p1.x*scale + offsetThisSlice.x, p1.y*scale + offsetThisSlice.y, p2.x*scale + offsetThisSlice.x, p2.y*scale + offsetThisSlice.y,);

                }
                // if (modelState.history.length > 99) {
                //     console.log( "HERE", historySlice.size);
                //     throw new Error();
                // }
                prevHistorySlice = historySlice;
            }

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
                        <Sketch className="p5canvas" setup={setup} draw={draw} />
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
