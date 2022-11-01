import React from "react";
import Button from "components/button";
import "./personalQR.scss";
import QRImage from "assets/images/QR_Code_Model.jpg";
import IconLeft from "assets/images/icon-left.svg";
import { Link } from "react-router-dom";

const PersonalQR = ({ showModal, QRImage }: { showModal: any; QRImage: string }) => {
  const closeModal = () => {
    showModal(false);
  };
  return (
    <div className="personalQR">
      <div className="personalQR__wrapper">
        <div className="personalQR__header">
          <div className="content" onClick={closeModal}>
            <img src={IconLeft} alt="QRimg" />
            <span>Atpakaļ pie saraksta</span>
          </div>
        </div>
        <div className="personalQR__ImageWrapper">
          <img src={QRImage} alt="qrImage" />
        </div>
        {/* <div className="personalQR__buttons">
          <button type="button" className="btn-E">
            E-pasts
          </button>
          <button type="button" className="btn-sms">
            SMS
          </button>
        </div>
        <div className="accept-wrapper">
          <button type="button" className="btn-accept">
            Nosūtīt
          </button>
        </div>
        <Button
          title="Atcelt"
          iconArrow={undefined}
          iconLogOut={undefined}
          iconPersonalQR={undefined}
          onClick={closeModal}
          type="not"
          disabled={undefined}
        /> */}
      </div>
    </div>
  );
};

export default PersonalQR;
