import React, { useState } from "react";
import "./style.scss";

import ScanIcon from "assets/images/icon-QR.svg";
import ListIcon from "assets/images/icon-list.svg";
import { Link } from "react-router-dom";

const Footer = () => {

  const [activeList, setActiveList] = useState<boolean>(false)
  const [activeScan, setActiveScan] = useState<boolean>(true)

  const handleChange = () => {
    setActiveScan(!activeScan)
    setActiveList(!activeList)
  }

  return (
    <div className="footer">
      <div className={activeScan ? "scanQRcode active" : "scanQRcode "}>
      <Link to="/registration" onClick={handleChange}>
      <img src={ScanIcon} alt="scanIcon" />
        <h3>Scan QR Code</h3>
      </Link>
      </div>
      <div className={activeList ? "list active" : "list"}>
      <Link to="/attendanceList" onClick={handleChange}>
       <img src={ListIcon} alt="listIcon" />
        <h3>Attendance list</h3>
      </Link>
      </div>
    </div>
  );
};

export default Footer;
