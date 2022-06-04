

const ColorCard = ({color, onclick, flash}) => {
    return (
        <div  onClick={ onclick } className={`colorCard ${color} ${flash? "flash":""}`} ></div>
    );
};

export default ColorCard;