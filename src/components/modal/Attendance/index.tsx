import React, { useEffect, useLayoutEffect, useState } from "react";
import QrCode from "qrcode";
import Button from "components/button";
import "./style.scss";
import checkedIcon from "assets/images/icon-checked.svg";
import axios from "axios";
import {
  getToken,
  saveOffline,
  getMode,
  getAttendance,
  unverifyAttendance,
  verifyAttendance,
  changeSentStatus,
} from "store/db";
import isReachable from "is-reachable";
import SendOffline from "offline";
import PersonalQR from "../PersonalQR";

const worker = new Worker(new URL("../../../workers/thread.worker.ts", import.meta.url));

const Attendance = ({
  events,
  attendee,
  showModal,
  showVerified,
  showCancelled,
  setUpdateAtt,
  personalQR,
}: {
  events: any;
  showCancelled: any;
  attendee: any;
  showModal: any;
  showVerified: any;
  setUpdateAtt: any;
  personalQR: any;
}) => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPersonalQR, setShowPersonalQR] = useState<boolean>(false);
  const [qrcode, setQrcode] = useState<string>("");
  const [fastMode, setFastMode] = useState<any>(true);

  useEffect(() => {
    const listener = ({ data }: { data: any }) => {
      console.log(data.type, data.payload);

      if (data.type === "UPDATE_SUCCESS") console.log(data.payload);
    };

    worker.addEventListener("message", listener);

    return () => worker.removeEventListener("message", listener);
  }, []);

  const handleError = (err: any) => {
    console.log(err);
  };

  useEffect(() => {
    const getModeDB = async () => {
      const stat = await getMode();
      setFastMode(stat);
    };
    const url = `${process.env.REACT_APP_API_BASE_URL}/pupil/${attendee[0]?.qr_uuid}`;
    QrCode.toDataURL(url, { margin: 2 }, (err, url) => {
      if (err) return console.error(err);
      setQrcode(url);
    });
    getModeDB();
  }, []);

  const handleShowPersonalQR = () => {
    setShowPersonalQR(true);
  };
  const closeModal = () => {
    showModal(false);
  };

  const register = async (e: any) => {
    setLoading(true);
    if (fastMode || !(await isReachable(process.env.REACT_APP_API_BASE_URL!))) {
      await changeSentStatus(parseInt(e.target.value), "failed");
      await verifyAttendance(parseInt(e.target.value));
      const offlineData = {
        id: e.target.value,
        status: "verify",
        attemptedTimestamp: new Date(),
      };
      await saveOffline(offlineData);
      setUpdateAtt(e.target.value);
      showVerified(true);
      setLoading(false);
      showModal(false);
      worker.postMessage({ type: "UPDATE" });
    } else {
      await SendOffline();
      const token = await getToken();
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/pwa/attendance/${e.target.value}/verify`,
          { verified_at: new Date().toLocaleDateString() },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(async function (response) {
          await changeSentStatus(parseInt(e.target.value), "sent");
          await verifyAttendance(parseInt(e.target.value));
          setUpdateAtt(e.target.value);
          showVerified(true);
          setLoading(false);
          showModal(false);
        })
        .catch(async function (error) {
          console.log("sentERROR", error);
          await changeSentStatus(parseInt(e.target.value), "failed");
        });
    }
  };

  const confirmDialog = () => {
    setConfirm(true);
  };

  const cancelAttendance = async (e: any) => {
    setLoading(true);
    if (fastMode || !(await isReachable(process.env.REACT_APP_API_BASE_URL!))) {
      await unverifyAttendance(parseInt(e.target.value));
      const offlineData = {
        id: e.target.value,
        status: "cancel",
      };
      setUpdateAtt(e.target.value);
      await saveOffline(offlineData);
      showCancelled(true);
      setLoading(false);
      showModal(false);
    } else {
      await SendOffline();
      const token = await getToken();
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/pwa/attendance/${e.target.value}/unverify`,
          { verified_at: new Date().toLocaleDateString() },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(async function (response) {
          await unverifyAttendance(parseInt(e.target.value));
          setUpdateAtt(e.target.value);
          showCancelled(true);
          setLoading(false);
          showModal(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  useLayoutEffect(() => {
    let audio = new Audio("/ES_Multimedia Prompt 765 - SFX Producer.mp3");
    audio.play();
  }, []);

  return (
    <div className="attendance">
      {showPersonalQR && <PersonalQR showModal={setShowPersonalQR} QRImage={qrcode} />}
      <div className="attendance__wrapper">
        <div className="head">
          <h3>{attendee && attendee[0]?.full_name}</h3>
          <p>{attendee && attendee[0]?.class_name}</p>
        </div>

        {events?.map((event: any) => {
          const att = attendee.find((att: any) => att.attendance_id === event.id);
          if (att) {
            return (
              <>
                <div key={event.id} className="content">
                  <div className="items">
                    {att.verified == 1 && (
                      <img
                        key={event.id}
                        className="checkedIcon"
                        src={checkedIcon}
                        alt="checkedIcon"
                      />
                    )}
                    <div>
                      <h4 key={event.id}>{event.service_series_name}</h4>
                      {att.verified == 1 ? (
                        <span key={Math.random()} className="attendanceVerified">
                          Apmeklējums reģistrēts
                        </span>
                      ) : att.status.toLowerCase().includes("attending") ? (
                        <span key={Math.random()} className="attending">
                          Plānots
                        </span>
                      ) : att.status.toLowerCase().includes("cancelled") ? (
                        <span key={Math.random()} className="notattending">
                          Pieteikts kavējums
                        </span>
                      ) : (
                        <span key={Math.random()} className="attending">
                          Plānots
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {att.verified === 0 ? (
                  <Button
                    key={5}
                    disabled={loading}
                    title="Reģistrēt apmeklējumu"
                    value={att.id}
                    type="green"
                    iconArrow={undefined}
                    iconLogOut={undefined}
                    onClick={register}
                    iconPersonalQR={undefined}
                  />
                ) : (
                  <Button
                    disabled={loading}
                    value={att.id}
                    title={confirm ? "Apstiprināt?" : "Atcelt apmeklējumu"}
                    type={confirm ? "red" : "redBordered"}
                    iconArrow={undefined}
                    iconLogOut={undefined}
                    onClick={confirm ? cancelAttendance : confirmDialog}
                    iconPersonalQR={undefined}
                  />
                )}
              </>
            );
          }
        })}
        <div className="cancel">
          {personalQR ? (
            <Button
              disabled={false}
              title="Personīgais QR kods"
              type="fiolBordered"
              iconArrow={undefined}
              iconLogOut={undefined}
              onClick={handleShowPersonalQR}
              iconPersonalQR={true}
            />
          ) : null}
          <Button
            disabled={false}
            title="Atcelt"
            type="not"
            iconArrow={undefined}
            iconLogOut={undefined}
            onClick={closeModal}
            iconPersonalQR={undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
