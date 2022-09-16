import React from "react";
import "./style.scss";

import IconSettings from "assets/images/icon-settings.svg";
import IconLeft from "assets/images/icon-left.svg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div className="leftIcon">
        <img src={IconLeft} alt="leftIcon" />
        <Link to="/events"><span>Events</span></Link>
      </div>
      <h3 className="title">Scan QR Code</h3>
      <Link to="/settings"><img className="settingsIcon" src={IconSettings} alt="settingsIcon" /></Link>
    </div>
  );
};

export default Header;
