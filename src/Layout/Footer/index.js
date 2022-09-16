import React from "react";
import "./style.scss";

import ScanIcon from "assets/images/icon-QR.svg";
import ListIcon from "assets/images/icon-list.svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="scanQRcode active">
      <Link to="/registration">
      <img src={ScanIcon} alt="scanIcon" />
        <h3>Scan QR Code</h3>
      </Link>
      </div>
      <div className="list">
      <Link to="/attendanceList">
       <img src={ListIcon} alt="listIcon" />
        <h3>Attendance list</h3>
      </Link>
      </div>
    </div>
  );
};

export default Footer;
