import React from "react";
import "./style.scss";
import IconRight from "assets/images/icon-arrow-right.svg"
import IconLog from "assets/images/icon-signout.svg"

const Button = ({title, iconArrow, iconLogOut, onClick, type, value = undefined, disabled}) => {
  return (
    <div className="contentButton">
      <button value={value} className={`submitButton bg-${type}`} disabled={disabled} onClick={onClick} type="button">
        {title}
        {iconArrow && <img className="iconRight" src={IconRight} alt="IconRight" />}
        {iconLogOut && <img className="iconLog" src={IconLog} alt="LogOut" />}
      </button>
    </div>
  );
};

export default Button;
