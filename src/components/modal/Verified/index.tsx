import React, { useEffect, useLayoutEffect } from "react";
import "./style.scss";
import Button from "components/button";

import IconChecked from "assets/images/icon-checked.svg"

const Verified = ({button, buttonTitle, data, showModal, continious, scanAllowed}:{button:any, buttonTitle:any,data:any,showModal:any, continious:any, scanAllowed: any}) => {
  useEffect(() => {    
    if (continious) setTimeout(() => closeModal(), 3000)
  }, [])

  useLayoutEffect(() => {
    let audio = new Audio("/ES_Multimedia Success 793 - SFX Producer.mp3")
    audio.play()
  }, [])

  const closeModal = () => {
    if (scanAllowed) scanAllowed(true)
    showModal(false)
  }


  return (
    <div className="modalOne">
      <div className="modalOne__wrapper">
        <img src={IconChecked} alt="iconChecked" />
        <h3>Apmeklējums reģistrēts!</h3>
        <p>{data != undefined ? data : ""}</p>
        {button && <Button disabled={false} title={buttonTitle} iconArrow={true} type="fiolet" iconLogOut={undefined} onClick={closeModal} />}

      </div>
    </div>
  );
};

export default Verified;
