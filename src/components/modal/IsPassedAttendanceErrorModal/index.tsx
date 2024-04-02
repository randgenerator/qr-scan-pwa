import React, { useEffect, useLayoutEffect } from "react";
import "./style.scss";
import Button from "components/button";

import IconDanger from "assets/images/icon-closed.svg";
import {useNavigate} from "react-router-dom";

const IsPassedAttendanceErrorModal = () => {
  useLayoutEffect(() => {
    let audio = new Audio("/ES_MM Error 21 - SFX Producer.mp3");
    audio.play();
  }, []);
  const navigate = useNavigate()
  const onClick = () => {
    navigate('/events')
  };

  return (
    <div className="modalSecond">
      <div className="modalSecond__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>Kļūda! Jūs mēģināt reģistrēt apmeklējumu pasākumā, kurš jau ir beidzies! Pārejiet uz sākuma skatu un izvēlieties šodienas pasākumu.</h3>
        <Button
            disabled={false}
            title={'Doties uz sākuma skatu'}
            iconArrow={true}
            type="fiolet"
            iconLogOut={undefined}
            onClick={onClick}
            iconPersonalQR={undefined}
        />
      </div>
    </div>
  );
};

export default IsPassedAttendanceErrorModal;
