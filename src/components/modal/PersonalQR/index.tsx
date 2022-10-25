import React from "react";
import Button from "components/button";
import "./personalQR.scss";
import QRImage from "assets/images/QRImage.png";
import IconLeft from "assets/images/icon-left.svg";

const PersonalQR = () => {
  return (
    <div className="personalQR">
      <div className="personalQR__wrapper">
        <h3 className="personalQR__header">
          <img src={IconLeft} alt="QRimg" />
          Maribel Marsh
        </h3>
        <div className="personalQR__ImageWrapper">
          <img src={QRImage} alt="qrImage" />
        </div>
        <div className="personalQR__buttons">
          <button type="button" className="btn-E">
            E-pasts
          </button>
          <button type="button" className="btn-sms">
            SMS
          </button>
        </div>
        <button type="button" className="btn-accept">
          Nosūtīt
        </button>
        <Button
          title="Atcelt"
          iconArrow={undefined}
          iconLogOut={undefined}
          iconPersonalQR={undefined}
          onClick={undefined}
          type="not"
          disabled={undefined}
        />
      </div>
    </div>
  );
};

export default PersonalQR;
