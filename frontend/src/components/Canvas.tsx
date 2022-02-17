import React, { Component, useContext, useEffect, useRef, useLayoutEffect } from "react";

import { modelStore } from '../stores/ModelStore';
import { useBehavior } from '../hooks/useBehavior';

export interface CanvasProps {
    // temp: number;
}

const _Canvas: React.FC<CanvasProps> = (props: CanvasProps) =>  {
    const initialValue = false;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);



    const draw = (ctx: any, frameCount: number) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = '#000000'
        ctx.beginPath()
        ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
        // ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI * (props.temp / 180))
        ctx.fill()
    }

    useLayoutEffect(() => {


        const canvas = canvasRef.current;
        if (canvas != null) {
            const context = canvas.getContext('2d');
            if (context != null) {
                let frameCount: number = 0;
                let animationFrameId: any;
                //Our draw came here
                const render = () => {
                    frameCount++
                    draw(context, frameCount)
                    animationFrameId = window.requestAnimationFrame(render)
                }
                render()

                return () => {
                    window.cancelAnimationFrame(animationFrameId)
                }
            }
        }

    }, [draw]);


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

    return <canvas ref={canvasRef} {...props}/>
}

const Canvas = React.memo(_Canvas);
export default Canvas;
