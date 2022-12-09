import React from "react";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { MuiColorInput } from 'mui-color-input';

const Panel = props => {
    const {color, lineWidth, opacity, erasing, data, handleColor, handleLineWidth, handleOpacity, handleEraser} = props;
    
    return (
        <div>
            <Stack direction="column" spacing={1}>
                <div className="color">
                    <MuiColorInput 
                        value={color}
                        format="hex"
                        isAlphaHidden={true} 
                        size="small" 
                        variant="outlined"
                        onChange={handleColor} />
                </div>
                <div className="lineWidth">
                    <label>Line width:</label>
                    <Slider
                        size="small"
                        min={0}
                        max={20}
                        defaultValue={5}
                        value={lineWidth}
                        aria-label="Small"
                        valueLabelDisplay="auto"
                        onChange={handleLineWidth}
                        />
                </div>
                <div className="opacity">
                    <label>Opacity:</label>
                    <Slider
                        size="small"
                        min={0}
                        max={1}
                        step={0.1}
                        defaultValue={1}
                        value={opacity}
                        aria-label="Small"
                        valueLabelDisplay="auto"
                        onChange={handleOpacity}
                        />
                </div>
                <div className="eraser">
                    <Button 
                        fullWidth 
                        variant="outlined"
                        onClick={handleEraser}
                        style={erasing ? {
                                backgroundColor: '#dbdbdb'
                            } : {}}>
                            Erase
                        </Button>
                </div>
                <div className="save">
                    <Button 
                        fullWidth 
                        variant="contained"
                        href={data}
                        download="test.png">
                            Save
                        </Button>
                </div>
            </Stack>
        </div>
    )
}

export default Panel;