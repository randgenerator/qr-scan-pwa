import React from "react";
import "./style.scss";

import IconSettings from "assets/images/icon-settings.svg";
import IconLeft from "assets/images/icon-left.svg";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();


  return (
    <div className="header">        
        {location.pathname != "/events" ? <div className="leftIcon"><img src={IconLeft} alt="leftIcon" />{location.pathname === '/attendanceList/classes-view' ?<Link to="/attendanceList"><span>Atpakaļ</span></Link> :<Link to="/events"><span>Pasākumi</span></Link>}</div> : ""}
      <h3 className="title">{location.pathname === "/events" ? "Pasākumi" : location.pathname === "/registration" ? "QR skenēšana" : location.pathname === "/attendanceList" ? "Saraksts" : ( location.pathname === "/attendanceList/classes-view") ? 'Skatīt pa klasēm' : "Iestatījumi" }</h3>
      <Link to="/settings"><img className="settingsIcon" src={IconSettings} alt="settingsIcon" /></Link>
    </div>
  );
};

export default Header;
