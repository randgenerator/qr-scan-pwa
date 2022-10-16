import React, { useEffect, useLayoutEffect } from "react";
import "./style.scss";
import Button from "components/button";

import IconDanger from "assets/images/icon-closed.svg"

const NotFound = ({button, buttonTitle, showModal, continious, scanAllowed}:{button:any,buttonTitle:any,showModal:any, continious:any, scanAllowed: any}) => {
  useEffect(() => {
    if (continious) {
      setTimeout(() => scanAllowed(true), 1000)
      setTimeout(() => closeModal(), 2000)
    }
  }, [])
  
  useLayoutEffect(() => {
    let audio = new Audio("/ES_MM Error 21 - SFX Producer.mp3")
    audio.play()
  }, [])
  
  const closeModal = () => {
    showModal(false)
  }
  
  return (
    <div className="modalSecond">
      <div className="modalSecond__wrapper">
      <img src={IconDanger} alt="iconChecked" />
        <h3>Apmeklētājs nav atrasts!</h3>
        {button && <Button disabled={false} title={buttonTitle} iconArrow={true} type="fiolet" iconLogOut={undefined} onClick={closeModal} />}

      </div>
    </div>
  );
};

export default NotFound;
