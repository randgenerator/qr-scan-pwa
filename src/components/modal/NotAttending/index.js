import React from "react";
import "./style.scss";
import Button from "components/button";

import IconDanger from "assets/images/icon-danger.svg";

const NotAttending = () => {
  return (
    <div className="notAttending">
      <div className="notAttending__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>Attendant marked not attending!</h3>
        <p>Peter Johnson, 5A</p>
        <div className="events">
          <div className="lunchSeries">
            <h4 className="lunchTitle">Lunch series A</h4>
            <span>Not attending</span>
          </div>
          <Button title="Register attendance" type="green" />
        </div>
        <Button title="Scan next" type="fiolet" iconArrow={true} />
      </div>
    </div>
  );
};

export default NotAttending;
