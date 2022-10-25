import React, { useEffect, useLayoutEffect } from "react";
import "./style.scss";
import Button from "components/button";
import IconDanger from "assets/images/icon-danger.svg";

const InProgress = ({button, buttonTitle, data, showModal, continious, scanAllowed}:{button:any,buttonTitle:any,data:any,showModal:any, continious:any, scanAllowed: any}) => {
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
    <div className="modalThird">
      <div className="modalThird__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>Apmeklētājs jau reģistrēts!</h3>
        <p>{data}</p>
      {button && <Button disabled={false} title={buttonTitle} iconArrow={true} type="fiolet" iconLogOut={undefined} onClick={closeModal} />}
      </div>

    </div>
  );
};

export default InProgress;
