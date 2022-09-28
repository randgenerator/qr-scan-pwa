import React, { useEffect, useState } from "react";
import "./style.scss";
import SearchIcon from "assets/images/icon-search.svg";
import { getAttendance, getEvents, getSelectedEvents } from "store/db";
import Modal from "components/modal";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState<any>([])
  const [sorted, setSorted] = useState<any>([])
  const [selectedEvents, setSelectedEvents] = useState<any>([])
  const [search, setSearch] = useState<any>([])
  const [searchField, setSearchField] = useState<string>("")
  const [showRegistration, setShowRegistration] = useState<boolean>(false)
  const [selectedAttendee, setSelectedAttendee] = useState<any>([])
  const [showSeveral, setShowSeveral] = useState<boolean>(false)
  const [showVerified, setShowVerified] = useState<boolean>(false)

  useEffect(() => {
    const getEventsDB = async () => {
      const att = await getAttendance()
      const selected = await getSelectedEvents()
      const events = await getEvents()
      const selectedInt = selected?.map(ev => parseInt(ev))
      setSelectedEvents(events.filter(evt => selectedInt?.includes(evt.id)))
      const tempAtt = att.filter(attendance => selectedInt?.includes(attendance.attendance_id))
      setAttendances(tempAtt.sort((a, b) => a.full_name.localeCompare(b.full_name)))
      const grouped = tempAtt.reduce((att: any, c: any) => {
        const letter = c.full_name[0];
        if(!att[letter]) att[letter] = {letter, children: [c]}
        else att[letter].children.push(c);
        return att;
      }, {})
      let sort = Object.values(grouped)
      setSorted(sort.sort((a:any, b:any) => a.letter - b.letter))
      setSearch(tempAtt.sort((a, b) => a.full_name.localeCompare(b.full_name)))    
    }

    getEventsDB()
  }, [])

  useEffect(() => {
    if (searchField === "") {
      setSearch(attendances)
    } else {
      setSearch(attendances.filter((att:any) => att.full_name.includes(searchField) || att.class_name.includes(searchField)))
    }
  }, [searchField])

  const handleRegistration = (e:any) => {
    console.log("qr is ", e.target.dataset.qr)
    setSelectedAttendee(attendances.filter((att: any) => att.qr_uuid === e.target.dataset.qr))
    if (selectedAttendee.length > 1) setShowSeveral(true)
    setShowRegistration(true)
  }

  return (
    <div className="list">
      {showVerified && <Modal.Verified 
        showModal={setShowVerified} 
        scanAllowed={undefined} 
        button={true} 
        buttonTitle="Verify next"
        continious={false}
        data={undefined} />}
      {showRegistration && <Modal.Attendance
        showModal={setShowRegistration} 
        attendee={selectedAttendee}
        showVerified={setShowVerified}
        events={selectedEvents} />}
      <div className="list__search">
        <div className="input">
          <img src={SearchIcon} alt="searchIcon" />
          <input type="text" placeholder="search" onChange={(e) => setSearchField(e.target.value)} />
        </div>
        <button type="button">Cancel</button>
      </div>

      {search.map((attendee: any) => {
          return (
            <div className="list__items" data-qr={attendee.qr_uuid} key={attendee.id} onClick={handleRegistration}>
              <div className="item" data-qr={attendee.qr_uuid}>
                <h3 data-qr={attendee.qr_uuid}>{attendee.full_name}</h3>
                <span data-qr={attendee.qr_uuid}>{attendee.full_name}</span>
              </div>
              <span data-qr={attendee.qr_uuid} className="attending">{attendee.status}</span>
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
        {/* <li className="letter active">A</li> */}
        {sorted.map((att:any) => {
          return (
            <li className="letter">{att.letter}</li>
          )
        })}
      </ul>
    </div>
  );
};

export default AttendanceList;
