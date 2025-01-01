import React from 'react';

export interface ITooltipDescription {
    text: string; 
    children: React.ReactNode; 
}

export const TooltipDescription: React.FC<ITooltipDescription> = ({ text, children }) => {
    return (
        <div className="tooltip">
            <span className="tooltipText">{text}</span>
            {children}
        </div>
    );
};
