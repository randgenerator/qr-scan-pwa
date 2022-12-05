import React, { useEffect, useState } from "react";
import "./style.scss";
import SearchIcon from "assets/images/icon-search.svg";
import { getAttendance, getEvents, getSelectedEvents, getLastSync } from "store/db";
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
  const [countVerified, setCountVerified] = useState<number>();
  const [countFailed, setCountFailed] = useState<number>();
  const [countPlanned, setCountPlanned] = useState<number>();
  const [countTotal, setCountTotal] = useState<number>();
  const [syncTime, setSyncTime] = useState<Date | any>();

  useEffect(() => {
    const getEventsDB = async () => {
      await SyncAttendance();
      const sync = await getLastSync();
      const currentSync = sync?.toLocaleString("en-GB", { hour12: false });
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
      const filterVerified = groupedById.filter((att: any) => att.verified === 1);
      const filterFailed = groupedById.filter((att: any) => att.sentStatus == "failed");
      const filterPlanned = groupedById.filter((att: any) => att.verified == 0);

      setCountTotal(groupedById.length);
      setCountVerified(filterVerified.length);
      setCountFailed(filterFailed.length);
      setCountPlanned(filterPlanned.length);
      setSearch(groupedById);
      setGroupedAttendances(groupedById);
      setSyncTime(currentSync);
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
            att.full_name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(
                searchField
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, ""),
              ) ||
            att.class_name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(
                searchField
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, ""),
              ),
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
          data={selectedAttendee}
        />
      )}
      {showVerified && (
        <Modal.Verified
          showModal={setShowVerified}
          scanAllowed={undefined}
          button={false}
          buttonTitle="Verify next"
          continious={true}
          data={selectedAttendee}
          personalQR={true}
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
          personalQR={true}
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
      <div className="list__counted">
        <div className="left">
          <p>Verifikācijas: </p>
          <span className="countVerified">{countVerified || 0} </span>/
          <span className="countTotal"> {countTotal || 0} </span>/
          <span className="countPlanned"> {countPlanned || 0} </span>
          <span className="countFailed">({countFailed || 0})</span>
        </div>

        <p className="right">Saraksts sinhr: {syncTime} </p>
      </div>
      {search?.map((attendee: any) => {
        let UTCLocalTime = "";

        if (attendee.verified_at) {
          UTCLocalTime = attendee.verified_at?.replace(" ", "T").concat("Z");
        }
        const convertedUTC = new Date(UTCLocalTime);

        return (
          <div
            className="list__items"
            data-qr={attendee.qr_uuid}
            key={attendee.id}
            onClick={handleRegistration}>
            <div className="item" data-qr={attendee.qr_uuid}>
              <h3 data-qr={attendee.qr_uuid}>{attendee.full_name}</h3>
              <span data-qr={attendee.qr_uuid}>{attendee.class_name.toUpperCase()}</span>
            </div>
            {attendee?.verified === 1 ? (
              <div data-qr={attendee.qr_uuid} className="attendeeV">
                <h3 data-qr={attendee.qr_uuid} className="verified">
                  Apmeklējums reģistrēts
                </h3>
                <div data-qr={attendee.qr_uuid} className="statusV">
                  <h4 data-qr={attendee.qr_uuid} className="statusV__title">
                    Status:{" "}
                  </h4>{" "}
                  {attendee?.sentStatus === "sent" && (
                    <p data-qr={attendee.qr_uuid} className="verifiedAt">
                      Nosūtīts {convertedUTC.toLocaleString()}
                    </p>
                  )}
                  {attendee?.sentStatus === "failed" && (
                    <p data-qr={attendee.qr_uuid} className="failedAt">
                      Gaida savienojumu (#5{" "}
                      {attendee.attemptedTimestamp.toLocaleString({ hour12: false })}){" "}
                    </p>
                  )}
                </div>
              </div>
            ) : attendee.status.toLowerCase().includes("attended") ? (
              <div data-qr={attendee.qr_uuid} className="attendeeV">
                <h3 data-qr={attendee.qr_uuid} className="attending">
                  Plānots
                </h3>
                <div data-qr={attendee.qr_uuid} className="statusV">
                  {(attendee?.sentStatus === "sent" ||
                    (attendee?.sentStatus != "failed" && attendee?.verified_at)) && (
                    <>
                      <h4 data-qr={attendee.qr_uuid} className="statusV__title">
                        Status:
                      </h4>
                      <p data-qr={attendee.qr_uuid} className="verifiedAt">
                        Nosūtīts {convertedUTC.toLocaleString()}
                      </p>
                    </>
                  )}
                  {attendee?.sentStatus === "failed" && (
                    <>
                      <h4 data-qr={attendee.qr_uuid} className="statusV__title">
                        Status:
                      </h4>
                      <p data-qr={attendee.qr_uuid} className="failedAt">
                        Gaida savienojumu (#5 {convertedUTC.toLocaleString()})
                      </p>
                    </>
                  )}
                </div>
              </div>
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
