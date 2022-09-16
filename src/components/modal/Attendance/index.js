import React from "react";
import Button from "components/button";
import "./style.scss";

import checkedIcon from "assets/images/icon-checked.svg";

const Attendance = ({ attending, notAttending, attendanceVerified, twoSeries, typeColor, buttonTitle }) => {
  return (
    <div className="attendance">
      <div className="attendance__wrapper">
        <div className="head">
          <h3>Maribel Marsh</h3>
          <p>5A</p>
        </div>
        <div className="content">
          <div className="items">
            {attendanceVerified && (
              <img className="checkedIcon" src={checkedIcon} alt="checkedIcon" />
            )}
            <div>
              <h4>Lunch series A</h4>
              {attending && <span className="attending">Attending</span>}
              {notAttending && <span className="notattending">Not Attending</span>}
              {attendanceVerified && (
                <span className="attendanceVerified">Attendance verified</span>
              )}
            </div>
          </div>
          <p className="time">12:47</p>
        </div>
        <Button title={buttonTitle} type={typeColor} />
        {twoSeries && (
          <>
            <div className="content">
              <div className="items">
                {attendanceVerified && (
                  <img className="checkedIcon" src={checkedIcon} alt="checkedIcon" />
                )}
                <div>
                  <h4>Lunch series B</h4>
                  {attending && <span className="attending">Attending</span>}
                  {notAttending && <span className="notattending">Not Attending</span>}
                  {attendanceVerified && (
                    <span className="attendanceVerified">Attendance verified</span>
                  )}
                </div>
              </div>
              <p className="time">12:47</p>
            </div>
            <Button title="Register attendance" type="green" />
          </>
        )}
        <div className="cancel">
          <Button title="Cancel" type="fiolBordered" />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
