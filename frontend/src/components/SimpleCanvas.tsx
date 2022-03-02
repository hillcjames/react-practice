import React, { Component, useContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import Sketch from "react-p5";

import { Model } from "../types/Model";
import { Vector2d } from "../types/Vector2d";
import { mainStore } from '../stores/MainStore';
import { useBehavior } from '../hooks/useBehavior';
import { asTwoDigitStr } from "../util";


import '../css/canvas.css';

export interface SimpleCanvasProps {
    model: Model;
}

const _SimpleCanvas: React.FC<SimpleCanvasProps> = (props: SimpleCanvasProps) =>  {
    const initialValue = false;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [dimX, setDimX] = useState(0);
    const [dimY, setDimY] = useState(0);

    const [scale, setScale] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const [B, setB] = useState(0);

    const draw = (ctx: any, _frameCount: number) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        let deadStyle = '#000000';

        let offset = new Vector2d(0,0);
        for (let planet of props.model.state.planets) {
            ctx.fillStyle = '#000000';
            if (!planet.dead) {
                ctx.fillStyle = '#' + "4016F2";
            }
            ctx.beginPath()
            // ctx.arc(planet.pos.x, planet.pos.y, 1+1*Math.sin(_frameCount*0.01)**2, 0, 2*Math.PI)
            ctx.arc(planet.pos.x * scale + dimX/2, planet.pos.y * scale + dimY/2, planet.radius, 0, 2*Math.PI);
            // +1*Math.sin(_frameCount*0.01)**2
            // ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI * (props.temp / 180))
            ctx.fill()

            for (let i = 1; i < planet.prevLocs.length; i++) {
                let prevP = planet.prevLocs[i-1];
                let p = planet.prevLocs[i];
                // console.log("Drawing: " + planet.pos + " " + planet.prevLocs.length + " " + prevP + " " + p);
                ctx.beginPath();
                ctx.moveTo(prevP.x * scale + dimX/2, prevP.y * scale + dimY/2);
                ctx.lineTo(p.x * scale + dimX/2, p.y * scale + dimY/2);
                ctx.stroke();
            }

            // if (planet.name != "Sol" && planet.prevLocs.length == 6) {
            //     throw Error("test")
            // }
        }
        setDimX(ctx.canvas.width);
        setDimY(ctx.canvas.height);

    }

    useEffect (() => {
        mainStore.updateUniverseWidth(dimX);
        mainStore.updateUniverseHeight(dimY);

        // let solPos = new Vector2d(0,0);
        // Assume sun is always at 0,0.
        // for (let planet of props.model.state.planets) {
        //     // find furthest dims?
        // }

    }, [dimX, dimY]);

    // Initial effort: Just update in the animation loop.
    // Eventually refactor so that it'll keep running even when you aren't looking, with a pause button separate from the render cycle.
    // So like, you could add a new planet and move some around and have it render, without the simulation stepping forward.
    useLayoutEffect(() => {
        console.log("Canvas useLayoutEffect");
        const canvas = canvasRef.current;
        if (canvas != null) {
            const context = canvas.getContext('2d');
            if (context != null) {
                let frameCount: number = 0;
                let animationFrameId: any;
                //Our draw came here
                const render = () => {
                    frameCount++;
                    draw(context, frameCount);
                    props.model.dispatcher.runTick();
                    // setB(prevB => B+1);
                    animationFrameId = window.requestAnimationFrame(render);
                }
                render()

                return () => {
                    window.cancelAnimationFrame(animationFrameId);
                }
            }
        }

    }, [draw]);


    function resizeCanvas(canvas: HTMLCanvasElement) {
        const { width, height } = canvas.getBoundingClientRect()

        if (canvas.width !== width || canvas.height !== height) {
            const { devicePixelRatio:ratio=1 } = window;
            const context = canvas.getContext('2d');
            if (context != null) {
                canvas.width = width*ratio;
                canvas.height = height*ratio;
                context.scale(ratio, ratio);
                return true
            }
        }

        return false
      }

// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
// The fuck are these?
    // const predraw = (context, canvas) => {
    //     context.save()
    //     resizeCanvas(canvas)
    //     const { width, height } = context.canvas
    //     context.clearRect(0, 0, width, height)
    // }
    //
    // const postdraw = () => {
    //     index++
    //     ctx.restore()
    // }


    // const draw1 = (ctx: any) => {
    //   ctx.fillStyle = '#000000'
    //   ctx.beginPath()
    //   ctx.arc(50, 100, 20, 0, 2*Math.PI)
    //   ctx.fill()
    // }
    // useLayoutEffect(() => {
    //     const canvas = canvasRef.current;
    //     if (canvas != null) {
    //         const context = canvas.getContext('2d');
    //         if (context != null) {
    //             let frameCount: number = 0;
    //             let animationFrameId: any;
    //             //Our first draw
    //             // context.fillStyle = '#000000';
    //             // context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    //             //Our draw come here
    //             draw1(context)
    //         }
    //     }
    //
    // }, [draw1]);

    return <canvas className="Canvas" ref={canvasRef} {...props}/>
}

const SimpleCanvas = React.memo(_SimpleCanvas);
export default SimpleCanvas;
