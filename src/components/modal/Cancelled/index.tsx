import React, { useEffect } from "react";
import "./style.scss";
import Button from "components/button";

import IconChecked from "assets/images/icon-danger.svg"

const Cacnelled = ({button, buttonTitle, data, showModal, continious, scanAllowed, list}:{button:any, list:any, buttonTitle:any,data:any,showModal:any, continious:any, scanAllowed: any}) => {
  useEffect(() => {
    let audio = new Audio("/ES_Multimedia Prompt 765 - SFX Producer.mp3")
    audio.play()
    if (continious) setTimeout(() => closeModal(), 3000)
  }, [])

  const closeModal = () => {
    if (scanAllowed) scanAllowed(true)
    showModal(false)
  }


  return (
    <div className={list ? "modalTransparent" : "modalOne"}>
      <div className="modalOne__wrapper">
        <img src={IconChecked} alt="iconChecked" />
        <h3>Attendance cancelled!</h3>
        <p>{data != undefined ? data : ""}</p>
        {button && <Button title={buttonTitle} iconArrow={true} type="fiolet" iconLogOut={undefined} onClick={closeModal} />}

      </div>
    </div>
  );
};

export default Cacnelled;
