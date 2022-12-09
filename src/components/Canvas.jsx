import React, {useState, useEffect, useRef} from "react";
import Stack from "@mui/material/Stack";
import Panel from "./Panel";

import apple from "../assets/images/test_a.png";
import applePath from "../assets/images/test_a2.png";

const getDataFromContext = (context, x, y, width, height) => {
    try {
        const result = context.getImageData(x, y, width, height);
        return result;
    } catch(e) {
        return new Error(e.message);
    }
}

const Canvas = () => {
    const [dim, setDim] = useState({w: window.innerWidth - 120, h: window.innerHeight});
    const [imagePainted, setImagePainted] = useState(false);
    const [drawing, setDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [opacity, setOpacity] = useState(1);
    const [lineWidth, setLineWidth] = useState(5);
    const [erasing, setErasing] = useState(false);
    const [data, setData] = useState('#');
    
    const [area, setArea] = useState({
        minX: null,
        minY: null,
        maxX: null,
        maxY: null
    });
    
    const canvasRef = useRef(null);
    const canvasRef2 = useRef(null);
    const canvasRef3 = useRef(null);
    const canvasRef4 = useRef(null);
    const ctxRef = useRef(null);
    const ctxRef2 = useRef(null);
    const ctxRef3 = useRef(null);
    const ctxRef4 = useRef(null);
    
    const checkArea = (x, y) => {
        const testXMin = x - 11 > 0 ? x - 11 : 0;
        const testYMin = y - 11 > 0 ? y - 11 : 0;
        const testXMax = x + 11 < dim.w ? x + 11 : dim.w;
        const testYMax = y + 11 < dim.h ? y + 11 : dim.h;
        
        setArea(area => {
            let {minX, minY, maxX, maxY} = area;
            
            if (minX == null || testXMin < minX) {
                minX = testXMin;
            } 
            
            if (minY == null || testYMin < minY) {
                minY = testYMin;
            }
            
            if (maxX == null || testXMax > maxX) {
                maxX = testXMax;
            }
            
            if (maxY == null || testYMax > maxY) {
                maxY = testYMax;
            }
            
            return {minX, minY, maxX, maxY};
        })
    };
    
    const resetArea = () => {
        setArea(() => {
            return {
                minX: null,
                minY: null,
                maxX: null,
                maxY: null
            }
        });
    }
    
    const updateDownloadData = () => {
        try {
            const img = new Image();
            img.src = canvasRef2.current.toDataURL("image/png");
    
            img.onload = () => {
                ctxRef4.current.drawImage(img, 0, 0);
                
                const result = canvasRef4.current.toDataURL("image/png");
                setData(result);
            }
        } catch(e) {
            console.error(e.message);
        }
    };
    
    const startDrawing = e => {
        const [x1, y1] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
        const data = getDataFromContext(ctxRef.current, x1, y1, 1, 1);
        
        if (data instanceof Error) {
            console.error(data.message);
            return;
        }
        
        if (data[3] !== 0) {
            ctxRef2.current.beginPath();
            ctxRef2.current.moveTo(x1, y1);
            
            checkArea(x1, y1);
            setDrawing(true);
        }
    }
    
    const stopDrawing = () => {
        setDrawing(false);
        
        const {minX, minY, maxX, maxY} = area;
        const dX = maxX - minX;
        const dY = maxY - minY;
        
        const data1 = getDataFromContext(ctxRef.current, minX, minY, dX, dY);
        const data2 = getDataFromContext(ctxRef2.current, minX, minY, dX, dY);
    
        for (let p = 0; p < data1.data.length; p += 4) {
            const alpha = data1.data[p+3];
            
            if (alpha === 0) {
                data2.data[p+3] = 0;
            }
        }
        
        ctxRef2.current.putImageData(data2, minX, minY);
    
        resetArea();
        
        updateDownloadData();
    }
    
    const continueDrawing = e => {
        if(!drawing) {
            return;
        }
        
        const [x1, y1] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
        
        const data = getDataFromContext(ctxRef.current, x1, y1, 1, 1);
        
        if (data instanceof Error) {
            console.error(data.message);
            return;
        }
        
        if (data[3] === 0) {
            setDrawing(false);
            return;
        }
        
        if(erasing) {
            ctxRef2.current.globalCompositeOperation = "destination-out";
            ctxRef2.current.strokeStyle = "rgba(0,0,0,0.5)";
        } else {
            ctxRef2.current.globalCompositeOperation = "source-over";
        }
        
        ctxRef2.current.lineTo(x1, y1);
        
        checkArea(x1, y1);
        
        ctxRef2.current.stroke();
    }
    
    const handleColor = newValue => {
        setColor(newValue);
    }
    
    const handleLineWidth = (event, newValue) => {
        setLineWidth(newValue);
    }
    
    const handleOpacity = (event, newValue) => {
        setOpacity(newValue);
    }
    
    const handleEraser = () => {
        setErasing(! erasing);
    }
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        ctxRef.current = ctx;
        
        const canvas2 = canvasRef2.current;
        const ctx2 = canvas2.getContext("2d");
        
        ctxRef2.current = ctx2;
        
        ctxRef2.current.lineCap = "round";
        ctxRef2.current.lineJoin = "round";
        ctxRef2.current.lineWidth = lineWidth;
        ctxRef2.current.globalAlpha = opacity;
        ctxRef2.current.strokeStyle = color;
        
        const canvas3 = canvasRef3.current;
        const ctx3 = canvas3.getContext("2d");
        
        ctxRef3.current = ctx3;
        
        const canvas4 = canvasRef4.current;
        const ctx4 = canvas4.getContext("2d");
        
        ctxRef4.current = ctx4;
        
        if(! imagePainted) {
            const image = new Image();
            image.src= apple;
            
            const image2 = new Image();
            image2.src = applePath;

            image.onload = () => {
                
                ctxRef.current.drawImage(image, 0, 0);
                ctxRef4.current.drawImage(image, 0, 0);
                
                image2.onload = () => {
                    ctxRef3.current.drawImage(image2, 0, 0);
                    ctxRef4.current.drawImage(image2, 0, 0);
                    
                    setImagePainted(true);
                }
            }
            
            const {width, height} = image;

            setDim(dim => {
                const newDim = {...dim};
                newDim.w = width + 10;
                newDim.h = height + 10;
                return newDim;
            });
        }
    }, [color, lineWidth, opacity, dim, imagePainted]);
    
    return (
        <Stack direction="row" spacing={2}>
            <div className="panelWrap" style={{width: '120px', padding: '10px', position: 'fixed', zIndex: 9999, backgroundColor: '#fff'}}>
                <Panel 
                    color={color}
                    handleColor={handleColor}
                    lineWidth={lineWidth}
                    handleLineWidth={handleLineWidth}
                    opacity={opacity}
                    handleOpacity={handleOpacity}
                    erasing={erasing}
                    handleEraser={handleEraser}
                    data={data}
                    />
            </div>
            <div className="canvasWrap" style={{position: 'relative', marginLeft: '140px'}}>
                <canvas style={{position: 'absolute', top: 0, left: 0}}
                    ref={canvasRef}
                    width={dim.w} 
                    height={dim.h} />
                <canvas style={{position: 'absolute', top: 0, left: 0}}
                    ref={canvasRef2}
                    width={dim.w}
                    height={dim.h} />
                <canvas style={{position: 'absolute', top: 0, left: 0}}
                    ref={canvasRef3}
                    onMouseDown={startDrawing}
                    onMouseMove={continueDrawing}
                    onMouseUp={stopDrawing}
                    width={dim.w}
                    height={dim.h} />
                <canvas style={{display: 'hidden'}}
                    ref={canvasRef4}
                    width={dim.w}
                    height={dim.h} />
            </div>
        </Stack> 
    )
}

export default Canvas;