import React, { useState } from "react";


interface IToggleButton {
    activeColor: string;
    isDisabled?: boolean;
}

export const ToggleButton: React.FC<IToggleButton> = ({
    activeColor,
    isDisabled
}) => {

    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        setIsOn((prevState) => !prevState);
    };

    return (
        <button disabled={isDisabled}  className={`button-wrapper ${isOn ? "on" : "off"}`} style={{
            backgroundColor: isOn ? activeColor : "#C9C9C9", 
        }}
        onClick={handleToggle}
        >

            <div className="toggler"></div>
        </button>
    )
}