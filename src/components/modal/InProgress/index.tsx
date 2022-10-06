import React, { useEffect, useLayoutEffect } from "react";
import "./style.scss";
import Button from "components/button";
import IconDanger from "assets/images/icon-danger.svg";

const InProgress = ({button, buttonTitle, data, showModal, continious, scanAllowed}:{button:any,buttonTitle:any,data:any,showModal:any, continious:any, scanAllowed: any}) => {
  useEffect(() => {
    if (continious) setTimeout(() => closeModal(), 3000)
  }, [])

  useLayoutEffect(() => {
    let audio = new Audio("/ES_MM Error 21 - SFX Producer.mp3")
    audio.play()
  }, [])

  const closeModal = () => {
    scanAllowed(true)
    showModal(false)
  }

  return (
    <div className="modalThird">
      <div className="modalThird__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>Apmeklētājs jau reģistrēts!</h3>
        <p>{data}</p>
      {button && <Button title={buttonTitle} iconArrow={true} type="fiolet" iconLogOut={undefined} onClick={closeModal} />}
      </div>

    </div>
  );
};

export default InProgress;
