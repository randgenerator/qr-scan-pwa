import React, { useEffect, useState } from "react";
import "./style.scss";
import SearchIcon from "assets/images/icon-search.svg";
import { getAttendance, getEvents, getSelectedEvents } from "store/db";
import Modal from "components/modal";
import SyncAttendance from "attendanceSync";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState<any>([]);
  const [groupedAttendances, setGroupedAttendances] = useState<any>([]);
  const [sorted, setSorted] = useState<any>([]);
  const [selectedEvents, setSelectedEvents] = useState<any>([]);
  const [search, setSearch] = useState<any>([]);
  const [searchField, setSearchField] = useState<string>("");
  const [showRegistration, setShowRegistration] = useState<boolean>(false);
  const [selectedAttendee, setSelectedAttendee] = useState<any>([]);
  const [showSeveral, setShowSeveral] = useState<boolean>(false);
  const [showVerified, setShowVerified] = useState<boolean>(false);
  const [showCancelled, setShowCancelled] = useState<boolean>(false);
  const [updateAtt, setUpdateAtt] = useState<number>();

  useEffect(() => {
    SyncAttendance();
    const getEventsDB = async () => {
      const att = await getAttendance();
      const selected = await getSelectedEvents();
      const events = await getEvents();
      const selectedInt = selected?.map((ev) => parseInt(ev));
      setSelectedEvents(events.filter((evt) => selectedInt?.includes(evt.id)));
      const tempAtt = att.filter((attendance) => selectedInt?.includes(attendance.attendance_id));
      setAttendances(tempAtt.sort((a, b) => a.full_name.localeCompare(b.full_name)));
      const grouped = tempAtt.reduce((att: any, c: any) => {
        const letter = c.full_name[0];
        if (!att[letter]) att[letter] = { letter, children: [c] };
        else att[letter].children.push(c);
        return att;
      }, {});
      let sort = Object.values(grouped);

      setSorted(sort.sort((a: any, b: any) => a.letter - b.letter));
      const sortedAtt = tempAtt.sort((a, b) => a.full_name.localeCompare(b.full_name));
      const groupedById = sortedAtt.filter(
        (att, index, allAtt) => allAtt.findIndex((v2) => v2.qr_uuid === att.qr_uuid) === index,
      );
      setSearch(groupedById);
      setGroupedAttendances(groupedById);
    };

    getEventsDB();
  }, [showVerified, showCancelled, showRegistration]);

  useEffect(() => {
    if (searchField === "") {
      setSearch(groupedAttendances);
    } else {
      setSearch(
        groupedAttendances.filter(
          (att: any) =>
            att.full_name.toLowerCase().includes(searchField.toLowerCase()) ||
            att.class_name.toLowerCase().includes(searchField.toLowerCase()),
        ),
      );
    }
  }, [searchField]);

  useEffect(() => {
    if (updateAtt) {
      let newAtt = [...attendances];
      const index = attendances.findIndex((att: any) => att.id == updateAtt);
      if (newAtt[index].verified == 0) {
        newAtt[index].verified = 1;
      } else {
        newAtt[index].verified = 0;
      }
      setAttendances(newAtt);
      const groupedById = newAtt.filter(
        (att, index, allAtt) => allAtt.findIndex((v2) => v2.qr_uuid === att.qr_uuid) === index,
      );
      setGroupedAttendances(groupedById);
      setSearch(groupedById);
    }
  }, [updateAtt]);

  const handleRegistration = (e: any) => {
    setSelectedAttendee(attendances.filter((att: any) => att.qr_uuid === e.target.dataset.qr));
    if (selectedAttendee.length > 1) setShowSeveral(true);
    setShowRegistration(true);
  };

  const clearSearch = () => {
    setSearchField("");
  };

  return (
    <div className="list">
      {showCancelled && (
        <Modal.Cancelled
          showModal={setShowCancelled}
          scanAllowed={undefined}
          button={false}
          buttonTitle="Verify next"
          continious={true}
          data={`${selectedAttendee[0].full_name},  ${selectedAttendee[0].class_name}`}
        />
      )}
      {showVerified && (
        <Modal.Verified
          showModal={setShowVerified}
          scanAllowed={undefined}
          button={false}
          buttonTitle="Verify next"
          continious={true}
          data={`${selectedAttendee[0].full_name},  ${selectedAttendee[0].class_name}`}
        />
      )}
      {showRegistration && (
        <Modal.Attendance
          setUpdateAtt={setUpdateAtt}
          showModal={setShowRegistration}
          attendee={selectedAttendee}
          showVerified={setShowVerified}
          showCancelled={setShowCancelled}
          events={selectedEvents}
        />
      )}
      <div className="list__search">
        <div className="input">
          <img src={SearchIcon} alt="searchIcon" />
          <input
            type="text"
            value={searchField}
            placeholder="Meklēt"
            onChange={(e) => setSearchField(e.target.value)}
          />
        </div>
        {searchField && (
          <button type="button" onClick={clearSearch}>
            Cancel
          </button>
        )}
      </div>

      {search.map((attendee: any) => {

        return (
          <div
            className="list__items"
            data-qr={attendee.qr_uuid}
            key={attendee.id}
            onClick={handleRegistration}>
            <div className="item" data-qr={attendee.qr_uuid}>
              <h3 data-qr={attendee.qr_uuid}>{attendee.full_name}</h3>
              <span data-qr={attendee.qr_uuid}>{attendee.class_name}</span>
            </div>
            {attendee.verified === 1 ? (
              <div className="attendeeV">
                <span data-qr={attendee.qr_uuid} className="verified">
                  Apmeklējums reģistrēts
                </span>
                <div className="status">
                  <span className="status__title">Status: </span>{" "}
                  <p className="verifiedAt">
                    {" "}
                    {attendee.sentStatus == "sent" ? attendee.verified_at : attendee.attemptedTimestamp}
                  </p>
                </div>
              </div>
            ) : attendee.status.toLowerCase().includes("attending") ? (
              <span data-qr={attendee.qr_uuid} className="attending">
                Plānots
              </span>
            ) : attendee.status.toLowerCase().includes("cancelled") ? (
              <span data-qr={attendee.qr_uuid} className="notattending">
                Pieteikts kavējums
              </span>
            ) : (
              <span data-qr={attendee.qr_uuid} className="attending">
                Plānots
              </span>
            )}
          </div>
        );
      })}

      {/* <ul className="list__letters">
        {sorted.map((att: any) => {
          return <li className="letter">{att.letter}</li>;
        })}
      </ul> */}
    </div>
  );
};

export default AttendanceList;
