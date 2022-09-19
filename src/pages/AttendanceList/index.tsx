import React, { useEffect, useState } from "react";
import "./style.scss";
import SearchIcon from "assets/images/icon-search.svg";
import { getAttendance, getSelectedEvents } from "store/db";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState<any>([])
  const [selectedEvents, setSelectedEvents] = useState<any>([])
  const [sorted, setSorted] = useState<any>([])

  useEffect(() => {
    const getEventsDB = async () => {
      const att = await getAttendance()
      const selected = await getSelectedEvents()
      setSelectedEvents(selected?.map(ev => parseInt(ev)))
      setAttendances(att.filter(attendance => selectedEvents.includes(attendance.attendance_id)))
      const grouped = attendances.reduce((att: any, c: any) => {
        const letter = c.full_name[0];
        if(!att[letter]) att[letter] = {letter, children: [c]}
        else att[letter].children.push(c);
        return att;
      }, {})
      let sort = Object.values(grouped)
      setSorted(sort.sort((a:any, b:any) => a.letter - b.letter))      
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

    {sorted.map((attendee: any) => {
      return (
      attendee.children.map((att: any) => {
        return (
          <div className="list__items">
            <div className="item">
              <h3>{att.full_name}</h3>
              <span>{att.full_name}</span>
            </div>
            <span className="attending">{att.status}</span>
          </div>
        )
      })
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
        {/* <li className="letter active">A</li> */}
        {sorted.map((letter:any) => {
          return (
            <li className="letter">{letter}</li>
          )
        })}
      </ul>
    </div>
  );
};

export default AttendanceList;
