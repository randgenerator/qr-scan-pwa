import React from "react";
import Button from "components/button";
import "./style.scss";

import checkedIcon from "assets/images/icon-checked.svg";

const Attendance = ({ events, attendee, showModal }:{events:any, attendee:any, showModal:any}) => {

  const closeModal = () => {
    showModal(false)
  }

  console.log(attendee)

  return (
    <div className="attendance">
      <div className="attendance__wrapper">
        <div className="head">
          <h3>{attendee[0].full_name}</h3>
          <p>{attendee[0].class_name}</p>
        </div>
        <div className="content">
          <div className="items">
            
            <div>
            {events.map((event:any) => {
              const att = attendee.find((att:any) => att.attendance_id === event.id)
              if (att) {
                return (
                  <>
                  {att.verified === 1 ? <img className="checkedIcon" src={checkedIcon} alt="checkedIcon" /> : ""}

                  <h4>{event.service_series_name}</h4>

                  {att.verified === 1 ? <span className="attendanceVerified">Attendance verified</span> : att.status.toLowerCase().includes("attending") ? <span className="attending">Attending</span> : att.status.toLowerCase().includes("not_attending") ? <span className="notattending">Not Attending</span> : att.status.toLowerCase().includes("cancelled") ? <span className="notattending">Cancelled</span> : ""}
                  
                  {att.verified === 0 ? <Button title="Register attendance" type="green" iconArrow={undefined} iconLogOut={undefined} onClick={undefined} /> : ""}
                  
                  </>
                )
              }
            })}
            <div className="cancel"><Button title="Cancel" type="fiolBordered" iconArrow={undefined} iconLogOut={undefined} onClick={closeModal} /></div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
