import React, { useState } from "react";


interface IToggleButton {
    color: string
}

export const ToggleButton: React.FC<IToggleButton> = ({
    color
}) => {

    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        setIsOn((prevState) => !prevState);
    };

    return (
        <div  className={`button-wrapper ${isOn ? "on" : "off"}`} style={{
            backgroundColor: color, 
        }}
        onClick={handleToggle}
        >

            <div className="toggler"></div>
        </div>
    )
}