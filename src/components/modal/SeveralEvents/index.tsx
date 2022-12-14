import React, { useEffect, useLayoutEffect, useState } from "react";
import "./style.scss";
import IconDanger from "assets/images/icon-danger.svg";
import axios from "axios";
import { changeSentStatus, getToken, saveOffline, unverifyAttendance, verifyAttendance } from "store/db";
import isReachable from "is-reachable";
import Button from "components/button";
import SendOffline from "offline";

const SeveralEvents = ({
  events,
  attendee,
  showModal,
  showError,
  multiple,
  scanAllowed,
  showSuccess,
  setUpdateAtt,
}: {
  events: any;
  multiple: any;
  setUpdateAtt: any;
  attendee: any;
  showModal: any;
  showError: any;
  scanAllowed: any;
  showSuccess: any;
}) => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (e: any) => {
    const id = e.target.value;
    setLoading(true);
    if (await isReachable(process.env.REACT_APP_API_BASE_URL!)) {
      await SendOffline();
      const token = await getToken();
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/pwa/attendance/${id}/verify`,
          {verified_at: new Date()},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(async function (response) {
          await changeSentStatus(parseInt(id), "sent")
          await verifyAttendance(parseInt(id));
          setUpdateAtt(parseInt(id));
          showModal(false);
          setLoading(false);
          showSuccess(true);
        })
        .catch(function (error) {
          if (error.response.data.error) {
            if (error.response.data.error.includes("already")) {
              showModal(false);
              setLoading(false);
              showError(true);
            }
          }
        });
    } else {
      await changeSentStatus(parseInt(id), "failed")
      await verifyAttendance(id);
      const offlineData = {
        id: id,
        status: "verify",
      };
      await saveOffline(offlineData);
      setUpdateAtt(parseInt(id));
      showSuccess(true);
      setLoading(false);
      showModal(false);
    }
  };

  const confirmDialog = () => {
    setConfirm(true);
  };

  const cancelRegister = async (e: any) => {
    const id = e.target.value;
    setLoading(true);
    if (await isReachable(process.env.REACT_APP_API_BASE_URL!)) {
      await SendOffline();
      const token = await getToken();
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/pwa/attendance/${id}/unverify`,
          {verified_at: new Date()},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(async function (response) {
          await unverifyAttendance(parseInt(id));
          setUpdateAtt(parseInt(id));
          showModal(false);
          setLoading(false);
          scanAllowed(true);
        })
        .catch(function (error) {
          console.log(error);
          showModal(false);
          setLoading(false);
          scanAllowed(true);
        });
    } else {
      await unverifyAttendance(parseInt(id));
      setUpdateAtt(parseInt(id));
      const offlineData = {
        id: id,
        status: "cancel",
      };
      await saveOffline(offlineData);
      showModal(false);
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (scanAllowed) scanAllowed(true);
    showModal(false);
  };

  useLayoutEffect(() => {
    let audio = new Audio("/ES_Multimedia Prompt 765 - SFX Producer.mp3");
    audio.play();
  }, []);

  return (
    <div className="severalEvents">
      <div className="severalEvents__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>
          {multiple
            ? "Dalībniekam pieteikts kavējums!"
            : "Attendant marked attending several events!"}
        </h3>
        <p>{`${attendee[0].full_name}, ${attendee[0].class_name}`}</p>
        <div>
          {events.map((event: any) => {
            const att = attendee.find((att: any) => att.attendance_id === event.id);
            if (att) {
              return (
                <>
                  <div className="lunchSeries">
                    <h4 className="lunchTitle">{event.service_series_name}</h4>
                    <span
                      className={
                        att.verified === 1
                          ? "verified"
                          : att.status.toLowerCase() == "attending"
                          ? "attending"
                          : "notAttending"
                      }>
                      {att.verified === 1 ? "Apmeklējums reģistrēts" : att.status}
                    </span>
                  </div>
                  {att.verified === 0 ? (
                    <Button
                      disabled={loading}
                      value={att.id}
                      title="Reģistrēt apmeklējumu"
                      type="green"
                      iconArrow={undefined}
                      iconLogOut={undefined}
                      onClick={handleRegister}
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
                      onClick={confirm ? cancelRegister : confirmDialog}
                      iconPersonalQR={undefined}
                    />
                  )}
                  {multiple && (
                    <>
                      <Button
                        disabled={false}
                        title="Personīgais QR kods"
                        type="fiolBordered"
                        iconArrow={undefined}
                        iconLogOut={undefined}
                        onClick={closeModal}
                        iconPersonalQR={true}
                      />
                      <Button
                        disabled={false}
                        title="Atcelt"
                        iconArrow={true}
                        type="fiolet"
                        iconLogOut={undefined}
                        onClick={closeModal}
                        iconPersonalQR={undefined}
                      />
                    </>
                  )}
                </>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default SeveralEvents;
