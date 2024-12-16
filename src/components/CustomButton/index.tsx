

interface ICustomButton {
    text?: string;
    padding?: string;
    color?: string;
    backgroundColor?: string;
    fontSize?: string;    
    fontWeight?: string;
    icon?: string; 
}


export const CustomButton: React.FC<ICustomButton> = ({
    text,
    padding,
    color,
    backgroundColor,
    fontSize, 
    fontWeight,
    icon
}) => {
    return (  
        <button className="custom-button" style={{ 
            padding,
            color,
            backgroundColor,
            fontSize, 
            fontWeight        
            }}>
            {text}
            {icon && <img src={icon}/>}
        </button>
    );
};

export default CustomButton;