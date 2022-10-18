import React, { useState } from "react";
import "./style.scss";

import ScanIcon from "assets/images/icon-QR.svg";
import ListIcon from "assets/images/icon-list.svg";
import { Link } from "react-router-dom";

const Footer = () => {

  const [activeList, setActiveList] = useState<boolean>(false)
  const [activeScan, setActiveScan] = useState<boolean>(true)

  const selectQR = () => {
    setActiveScan(true)
    setActiveList(false)
  }

  const selectList = () => {
    setActiveScan(false)
    setActiveList(true)
  }

  return (
    <div className="footer">
      <div className={activeScan ? "scanQRcode active" : "scanQRcode "}>
      <Link to="/registration" onClick={selectQR}>
      <img src={ScanIcon} alt="scanIcon" />
        <h3>QR skenēšana</h3>
      </Link>
      </div>
      <div className={activeList ? "list active" : "list"}>
      <Link to="/attendanceList" onClick={selectList}>
       <img src={ListIcon} alt="listIcon" />
        <h3>Apmeklējumu saraksts</h3>
      </Link>
      </div>
    </div>
  );
};

export default Footer;
