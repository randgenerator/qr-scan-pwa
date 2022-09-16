import React from "react";
import "./style.scss";
import Button from "components/button";

import IconDanger from "assets/images/icon-closed.svg"

const NotFound = ({button, buttonTitle}) => {
  return (
    <div className="modalSecond">
      <div className="modalSecond__wrapper">
      <img src={IconDanger} alt="iconChecked" />
        <h3>Attendant not found!</h3>
        {button && <Button title={buttonTitle} iconArrow={true} type="fiolet" />}

      </div>
    </div>
  );
};

export default NotFound;
