import React from "react";
import "./style.scss";
import Button from "components/button";
import IconDanger from "assets/images/icon-danger.svg";

const InProgress = ({button, buttonTitle, data}) => {
  return (
    <div className="modalThird">
      <div className="modalThird__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>Attendant already verified!</h3>
        <p>{data}</p>
      {button && <Button title={buttonTitle} iconArrow={true} type="fiolet" />}
      </div>

    </div>
  );
};

export default InProgress;