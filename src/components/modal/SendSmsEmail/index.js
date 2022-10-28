import React from "react";
import "./sendsms.scss";
import IconLeft from "assets/images/icon-left.svg";

const SendSmsEmail = () => {
  return (
    <div className="sendSms">
      <div className="sendSms__wrapper">
        <h3 className="sendSms__header">
          <img src={IconLeft} alt="QRimg" />
          Maribel Marsh
        </h3>
        <div className="sendSms__section">
          <h3>E-pasts</h3>
          <p>Ievadiet e-pasta adresi</p>
          <button className="btn" type="button">
            Nosūtīt
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendSmsEmail;
