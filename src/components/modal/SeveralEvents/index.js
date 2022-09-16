import React from "react";
import "./style.scss";
import Button from "components/button";

import IconDanger from "assets/images/icon-danger.svg";

const SeveralEvents = () => {
  return (
    <div className="severalEvents">
      <div className="severalEvents__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>Attendant marked attending several events!</h3>
        <p>Peter Johnson, 5A</p>
        <div>
          <div className="lunchSeries">
            <h4 className="lunchTitle">Lunch series A</h4>
            <span>Attending</span>
          </div>
          <Button title="Register attendance" type="green" />
        </div>
        <div className="lunchSeries">
          <h4 className="lunchTitle">Lunch series B</h4>
          <span>Attending</span>
        </div>
        <Button title="Register attendance" type="green" />
      </div>
    </div>
  );
};

export default SeveralEvents;
