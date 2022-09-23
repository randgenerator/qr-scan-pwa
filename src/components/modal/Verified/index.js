import React from "react";
import "./style.scss";
import Button from "components/button";

import IconChecked from "assets/images/icon-checked.svg"

const Verified = ({button, buttonTitle, data, showModal}) => {
  useEffect(() => {
    setTimeout(() => closeModal(), 3000)
  }, [])

  const closeModal = () => {
    showModal(false)
  }

  return (
    <div className="modalOne">
      <div className="modalOne__wrapper">
        <img src={IconChecked} alt="iconChecked" />
        <h3>Attendance verified!</h3>
        <p>{data}</p>
        {button && <Button title={buttonTitle} iconArrow={true} type="fiolet" />}

      </div>
    </div>
  );
};

export default Verified;
