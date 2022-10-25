import React from "react";
import "./style.scss";
import IconRight from "assets/images/icon-arrow-right.svg"
import IconLog from "assets/images/icon-signout.svg"
import IconPQR from "assets/images/icon-personal-arrow.png"

const Button = ({title, iconArrow, iconLogOut, iconPersonalQR, onClick, type, value = undefined, disabled}) => {
  return (
    <div className="contentButton">
      <button value={value} className={`submitButton bg-${type}`} disabled={disabled} onClick={onClick} type="button">
        {title}
        {iconArrow && <img className="iconRight" src={IconRight} alt="IconRight" />}
        {iconLogOut && <img className="iconLog" src={IconLog} alt="LogOut" />}
        {iconPersonalQR ? <img className="iconQRarrow" src={IconPQR} alt="QRImage" /> : null}
      </button>
    </div>
  );
};

export default Button;
