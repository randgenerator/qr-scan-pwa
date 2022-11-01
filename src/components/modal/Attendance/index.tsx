import React, { useEffect, useLayoutEffect, useState } from "react";
import QrCode from "qrcode";
import Button from "components/button";
import "./style.scss";
import checkedIcon from "assets/images/icon-checked.svg";
import axios from "axios";
import {
  getToken,
  saveOffline,
  getAttendance,
  unverifyAttendance,
  verifyAttendance,
  changeSentStatus,
} from "store/db";
import isReachable from "is-reachable";
import SendOffline from "offline";
import PersonalQR from "../PersonalQR";

const Attendance = ({
  events,
  attendee,
  showModal,
  showVerified,
  showCancelled,
  setUpdateAtt,
}: {
  events: any;
  showCancelled: any;
  attendee: any;
  showModal: any;
  showVerified: any;
  setUpdateAtt: any;
}) => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPersonalQR, setShowPersonalQR] = useState<boolean>(false);
  const [qrcode, setQrcode] = useState<string>("");

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/pupil/${attendee[0].qr_uuid}`;
    QrCode.toDataURL(url, { margin: 2 }, (err, url) => {
      if (err) return console.error(err);
      setQrcode(url);
    });
  }, []);

  const handleShowPersonalQR = () => {
    setShowPersonalQR(true);
  };
  const closeModal = () => {
    showModal(false);
  };

  const register = async (e: any) => {
    setLoading(true);
    if (await isReachable(process.env.REACT_APP_API_BASE_URL!)) {
      await SendOffline();
      const token = await getToken();
      const resp = await axios
        .post(
          `${process.env.REACT_APP_API_URL}/pwa/attendance/${e.target.value}/verify`,
          { verified_at: new Date() as any },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(async function (response) {
          await changeSentStatus(parseInt(e.target.value), "sent")
          return true;
        })
        .catch(function (error) {
          console.log(error);
           changeSentStatus(parseInt(e.target.value), "failed")

          return false;
        });
        console.log("resp", resp);
        
      if (resp) {
        await verifyAttendance(parseInt(e.target.value));
        setUpdateAtt(e.target.value);
        showVerified(true);
        setLoading(false);
        showModal(false);
      }
    } else {
      await verifyAttendance(parseInt(e.target.value));
      const offlineData = {
        id: e.target.value,
        status: "verify",
      };
      await saveOffline(offlineData);
      setUpdateAtt(e.target.value);
      showVerified(true);
      setLoading(false);
      showModal(false);
    }
  };

  const confirmDialog = () => {
    setConfirm(true);
  };

  const cancelAttendance = async (e: any) => {
    setLoading(true);
    if (await isReachable(process.env.REACT_APP_API_BASE_URL!)) {
      await SendOffline();
      const token = await getToken();
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/pwa/attendance/${e.target.value}/unverify`,
          {verified_at: new Date() as any },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(async function (response) {
          await changeSentStatus(parseInt(e.target.value), "sent")
          await unverifyAttendance(parseInt(e.target.value));
          setUpdateAtt(e.target.value);
          showCancelled(true);
          setLoading(false);
          showModal(false);
        })
        .catch(function (error) {
          changeSentStatus(parseInt(e.target.value), "failed")

          console.log(error);
        });
    } else {
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
    }
  };

  useLayoutEffect(() => {
    let audio = new Audio("/ES_Multimedia Prompt 765 - SFX Producer.mp3");
    audio.play();
  }, []);

  console.log("sss", );
  
  return (
    <div className="attendance">
      {showPersonalQR ? <PersonalQR showModal={setShowPersonalQR} QRImage={qrcode} /> : null}
      <div className="attendance__wrapper">
        <div className="head">
          <h3>{attendee[0].full_name}</h3>
          <p>{attendee[0].class_name}</p>
        </div>
    
        {events.map((event: any) => {
          const att = attendee.find((att: any) => att.attendance_id === event.id);
          if (att) {
            return (
              <>
                <div className="content">
                  <div className="items">
                    {att.verified === 1 ? (
                      <img className="checkedIcon" src={checkedIcon} alt="checkedIcon" />
                    ) : (
                      ""
                    )}
                    <div>
                      <h4>{event.service_series_name}</h4>
                      {att.verified === 1 ? (
                        <span className="attendanceVerified">Apmeklējums reģistrēts</span>
                      ) : att.status.toLowerCase().includes("attending") ? (
                        <span className="attending">Plānots</span>
                      ) : att.status.toLowerCase().includes("cancelled") ? (
                        <span className="notattending">Pieteikts kavējums</span>
                      ) : (
                        <span className="attending">Plānots</span>
                      )}
                    </div>
                  </div>
                </div>
                {att.verified === 0 ? (
                  <Button
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
          <Button
            disabled={false}
            title="Personīgais QR kods"
            type="fiolBordered"
            iconArrow={undefined}
            iconLogOut={undefined}
            onClick={handleShowPersonalQR}
            iconPersonalQR={true}
          />
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
