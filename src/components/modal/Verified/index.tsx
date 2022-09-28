import React, { useEffect } from "react";
import "./style.scss";
import Button from "components/button";

import IconChecked from "assets/images/icon-checked.svg"

const Verified = ({button, buttonTitle, data, showModal, continious, scanAllowed}:{button:any,buttonTitle:any,data:any,showModal:any, continious:any, scanAllowed: any}) => {
  useEffect(() => {
    if (continious) setTimeout(() => closeModal(), 3000)
  }, [])

  const closeModal = () => {
    if (scanAllowed) scanAllowed(true)
    showModal(false)
  }


  return (
    <div className="modalOne">
      <div className="modalOne__wrapper">
        <img src={IconChecked} alt="iconChecked" />
        <h3>Attendance verified!</h3>
        <p>{data != undefined ? data : ""}</p>
        {button && <Button title={buttonTitle} iconArrow={true} type="fiolet" iconLogOut={undefined} onClick={closeModal} />}

      </div>
    </div>
  );
};

export default Verified;
