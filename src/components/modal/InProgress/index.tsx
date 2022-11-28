import React, { useEffect, useLayoutEffect } from "react";
import "./style.scss";
import Button from "components/button";
import IconDanger from "assets/images/icon-danger.svg";

const InProgress = ({
  button,
  buttonTitle,
  data,
  showModal,
  continious,
  scanAllowed,
}: {
  button: any;
  buttonTitle: any;
  data: any;
  showModal: any;
  continious: any;
  scanAllowed: any;
}) => {
  useEffect(() => {
    if (continious) {
      setTimeout(() => scanAllowed(true), 1000);
      setTimeout(() => closeModal(), 2000);
    }
  }, []);

  useLayoutEffect(() => {
    let audio = new Audio("/ES_MM Error 21 - SFX Producer.mp3");
    audio.play();
  }, []);

  const closeModal = () => {
    scanAllowed(true)
    showModal(false);
  };

  let OnlyTime = new Date(data.verified_at).toLocaleTimeString('en-GB', { hour12: false });

   console.log("data", data);
   
  return (
    <div className="modalThird">
      <div className="modalThird__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>Apmeklētājs jau reģistrēts!</h3>
        <p>
          {data?.full_name},
          <span> {data?.class_name.toUpperCase()}</span>, <span>{OnlyTime}</span>
        </p>
        <p className="verifiedBy">Verificēja: {data?.verified_by_admin_email}</p>
        {button && (
          <Button
            disabled={false}
            title={buttonTitle}
            iconArrow={true}
            type="fiolet"
            iconLogOut={undefined}
            onClick={closeModal}
            iconPersonalQR={undefined}
          />
        )}
      </div>
    </div>
  );
};

export default InProgress;
