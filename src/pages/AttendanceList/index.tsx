import React, { useEffect, useState } from "react";
import "./style.scss";
import SearchIcon from "assets/images/icon-search.svg";
import { getAttendance, getSelectedEvents } from "store/db";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState<any>([])
  const [selectedEvents, setSelectedEvents] = useState<any>([])

  useEffect(() => {
    const getEventsDB = async () => {
      const att = await getAttendance()
      const selected = await getSelectedEvents()
      setSelectedEvents(selected?.map(ev => parseInt(ev)))
      setAttendances(att.filter(attendance => selectedEvents.includes(attendance.attendance_id)))

    }

    getEventsDB()
  }, [])

  return (
    <div className="list">
      <div className="list__search">
        <div className="input">
          <img src={SearchIcon} alt="searchIcon" />
          <input type="text" placeholder="search" />
        </div>
        <button type="button">Cancel</button>
      </div>

    {attendances.map((attendee: any) => {
      return (
        <div className="list__items">
          <div className="item">
            <h3>{attendee.full_name}</h3>
            <span>{attendee.full_name}</span>
          </div>
          <span className="attending">{attendee.status}</span>
        </div>
      )
    })}

      {/* <div className="list__items">
        <div className="item">
          <h3>Lastname First name</h3>
          <span>5A</span>
        </div>
        <span className="attending">Attending</span>
      </div>
      <div className="list__items activeItems">
        <div className="item">
          <h3>Lastname First name</h3>
          <span>5A</span>
        </div>
        <span className="notAttending">No Attending</span>
      </div>
      <div className="list__items">
        <div className="item">
          <h3>Lastname First name</h3>
          <span>5A</span>
        </div>
        <span className="verified">Verified</span>
      </div> */}
      <ul className="list__letters">
        <li className="letter active">A</li>
        <li className="letter">B</li>
        <li className="letter">C</li>
        <li className="letter">D</li>
        <li className="letter">E</li>
        <li className="letter">F</li>
        <li className="letter">G</li>
        <li className="letter">H</li>
        <li className="letter">I</li>
      </ul>
    </div>
  );
};

export default AttendanceList;
