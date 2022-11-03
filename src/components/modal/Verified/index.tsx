import React, { useEffect, useLayoutEffect } from "react";
import "./style.scss";
import Button from "components/button";

import IconChecked from "assets/images/icon-checked.svg";

const Verified = ({
  button,
  buttonTitle,
  data,
  showModal,
  continious,
  scanAllowed,
  personalQR
}: {
  button: any;
  buttonTitle: any;
  data: any;
  showModal: any;
  continious: any;
  scanAllowed: any;
  personalQR: any;
}) => {
  useEffect(() => {
    if (continious) {
      setTimeout(() => allowScan(), 1000);
      setTimeout(() => showModal(false), 2000);
    }
  }, []);

  useLayoutEffect(() => {
    let audio = new Audio("/ES_Multimedia Success 793 - SFX Producer.mp3");
    audio.play();
  }, []);

  const allowScan = () => {
    if (scanAllowed) scanAllowed(true);
  };

  const closeModal = () => {
    allowScan();
    showModal(false);
  };
 
  console.log("data", data[0]);
  
  return (
    <div className="modalOne">
      <div className="modalOne__wrapper">
        <img src={IconChecked} alt="iconChecked" />
        <h3>Apmeklējums reģistrēts!</h3>
        <p>{data?.full_name}{data?.class_name}</p>
        {
          data?.sentStatus == "sent" ? (
            <p className="statuss">Statuss: <span> Nosūtīts {data?.verified_at}</span></p>
            ): (
            <p className="statusF">Statuss: <span> Gaida savienojumu</span></p>
          )
        }
        {button && (
          <>
            {
              personalQR ? (
                <Button
              disabled={false}
              title="Personīgais QR kods"
              type="fiolBordered"
              iconArrow={undefined}
              iconLogOut={undefined}
              onClick={closeModal}
              iconPersonalQR={true}
            />
              ): null
            }
            <Button
              disabled={false}
              title={buttonTitle}
              iconArrow={true}
              type="fiolet"
              iconLogOut={undefined}
              onClick={closeModal}
              iconPersonalQR={true}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Verified;
