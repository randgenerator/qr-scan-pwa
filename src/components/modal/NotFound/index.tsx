import React, { useEffect } from "react";
import "./style.scss";
import Button from "components/button";

import IconDanger from "assets/images/icon-closed.svg"

const NotFound = ({button, buttonTitle, showModal, continious, scanAllowed}:{button:any,buttonTitle:any,showModal:any, continious:any, scanAllowed: any}) => {
  useEffect(() => {
    if (continious) setTimeout(() => closeModal(), 3000)
  }, [])
  
  const closeModal = () => {
    scanAllowed(true)
    showModal(false)
  }
  
  return (
    <div className="modalSecond">
      <div className="modalSecond__wrapper">
      <img src={IconDanger} alt="iconChecked" />
        <h3>Attendant not found!</h3>
        {button && <Button title={buttonTitle} iconArrow={true} type="fiolet" iconLogOut={undefined} onClick={closeModal} />}

      </div>
    </div>
  );
};

export default NotFound;
