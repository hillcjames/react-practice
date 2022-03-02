import React, { Component, useContext, useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense

import { ModelState } from "../types/Model";
import { Vector2d } from "../types/Vector2d";
import { mainStore } from '../stores/MainStore';
import { modelStore } from '../stores/ModelStore';
import { useBehavior } from '../hooks/useBehavior';
import { asTwoDigitStr, getMilliseconds } from "../util";


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

    const [p5, setP5] = useState<p5Types | null>(null);

    let scale = 3;

    const modelState = useBehavior(modelStore.modelState);
    const centerPointOfRef = useBehavior(modelStore.centerPointOfRef);
    const isSimPaused = useBehavior(modelStore.isSimPaused);


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
    useEffect( () => {
            // The 'current' property contains info of the reference:
            // align, title, ... , width, height, etc.
            if(divRef != null && divRef.current && divRef.current.offsetWidth > 0 && divRef.current.offsetHeight > 0){
                setWidth(divRef.current.offsetWidth);
                setHeight(divRef.current.offsetHeight);
                mainStore.updateUniverseWidth(width/scale);
                mainStore.updateUniverseHeight(height/scale);
                modelStore.updateCenterPointOfRef(new Vector2d(width/2, height/2));
                console.log("Updating new canvas  ", width, height);
                if (isP5Types(p5) && width !== 0 && height !== 0) {
                    p5.resizeCanvas(width, height);
                }
            }

        }, [divRef]);
    useEffect(() => {
        console.log("Re-rendering canvas (This shouldn't happen after startup)");
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


    function getOffset(): Vector2d {
        return new Vector2d(width/2 - centerPointOfRef.x * scale, height/2 - centerPointOfRef.y * scale)
    }

    const render = (p5: p5Types) => {
        p5.background(0);
        p5.stroke(255);
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
        // console.log(centerPointOfRef)
        let offset = getOffset();
        for (let planet of modelState.planets) {
            // ctx.fillStyle = '#000000';
            if (!planet.dead) {
                // ctx.fillStyle = '#' + "4016F2";
                let maxTrailWidth = planet.radius()*scale*0.6;
                for (let i = 2; i < planet.prevLocs.length; i++) {
                    let trailScalingFactor = i/planet.prevLocs.length;
                    trailScalingFactor*=trailScalingFactor;
                    trailScalingFactor*=trailScalingFactor;
                    trailScalingFactor*=trailScalingFactor;
                    p5.strokeWeight(0.15 + maxTrailWidth*trailScalingFactor);
                    let p1 = planet.prevLocs[i-1];
                    let p2 = planet.prevLocs[i];
                    let prevR = planet.radius() > 10 ? planet.radius()/10 : 1;
                    // p5.ellipse(prvLoc.x*scale + offset.x, prvLoc.y*scale + offset.y, prevR*scale, prevR*scale);
                    p5.line(p1.x*scale + offset.x, p1.y*scale + offset.y, p2.x*scale + offset.x, p2.y*scale + offset.y,);
                }
                p5.strokeWeight(1);
                p5.ellipse(planet.pos.x*scale + offset.x, planet.pos.y*scale + offset.y, planet.radius()*scale, planet.radius()*scale);
            }
        }

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
        <div className="p5canvas_div_wrapper" ref={divRef}>
            <Sketch className="p5canvas" setup={setup} draw={draw}  />
        </div>
    );
};

function isP5Types(obj: any): obj is p5Types {
    return obj !== undefined && obj !== null && obj.resizeCanvas !== undefined;
}

const P5Canvas = React.memo(_P5Canvas);
export default P5Canvas;
