import React, { Component, useContext, useEffect, useRef, useState, useLayoutEffect } from "react";

import { Model } from "../types/Model";
import { Vector2d } from "../types/Vector2d";
import { mainStore } from '../stores/MainStore';
import { useBehavior } from '../hooks/useBehavior';
import { asTwoDigitStr } from "../util";


import '../css/canvas.css';

export interface CanvasProps {
    model: Model;
}

const _Canvas: React.FC<CanvasProps> = (props: CanvasProps) =>  {
    const initialValue = false;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const canvasWidth = useBehavior(mainStore.canvasWidth);
    const canvasHeight = useBehavior(mainStore.canvasHeight);

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
        for (let planetoid of props.model.state.planetoidList) {
            ctx.fillStyle = '#000000';
            if (!planetoid.dead) {
                ctx.fillStyle = '#' + "4016F2";
            }
            ctx.beginPath()
            // ctx.arc(planetoid.pos.x, planetoid.pos.y, 1+1*Math.sin(_frameCount*0.01)**2, 0, 2*Math.PI)
            ctx.arc(planetoid.pos.x * scale + dimX/2, planetoid.pos.y * scale + dimY/2, planetoid.radius, 0, 2*Math.PI);
            // +1*Math.sin(_frameCount*0.01)**2
            // ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI * (props.temp / 180))
            ctx.fill()

            for (let i = 1; i < planetoid.prevLocs.length; i++) {
                let prevP = planetoid.prevLocs[i-1];
                let p = planetoid.prevLocs[i];
                ctx.beginPath();
                ctx.moveTo(prevP.x, prevP.y);
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            }
        }
        setDimX(ctx.canvas.width);
        setDimY(ctx.canvas.height);

    }

    useEffect (() => {
        console.log("Canvas is updating on the react-side");
    });

    useEffect (() => {
        mainStore.updateCanvasWidth(dimX);
        mainStore.updateCanvasHeight(dimY);

        // let solPos = new Vector2d(0,0);
        // Assume sun is always at 0,0.
        // for (let planetoid of props.model.state.planetoidList) {
        //     // find furthest dims?
        // }

    }, [dimX, dimY]);

    // Initial effort: Just update in the animation loop.
    // Eventually refactor so that it'll keep running even when you aren't looking, with a pause button separate from the render cycle.
    // So like, you could add a new planet and move some around and have it render, without the simulation stepping forward.
    useLayoutEffect(() => {
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

const Canvas = React.memo(_Canvas);
export default Canvas;
