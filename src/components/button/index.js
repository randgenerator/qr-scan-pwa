import React from "react";
import "./style.scss";
import IconRight from "assets/images/icon-arrow-right.svg"
import IconLog from "assets/images/icon-signout.svg"

const Button = ({title, iconArrow, iconLogOut, onClick, type}) => {
  return (
    <div className="contentButton">
      <button className={`submitButton bg-${type}`} onClick={onClick} type="button">
        {title}
        {iconArrow && <img className="iconRight" src={IconRight} alt="IconRight" />}
        {iconLogOut && <img className="iconLog" src={IconLog} alt="LogOut" />}
      </button>
    </div>
  );
};

export default Button;
