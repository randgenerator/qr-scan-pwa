import React, { useEffect, useLayoutEffect, useState } from "react";
import "./style.scss";
import Button from "components/button";
import IconDanger from "assets/images/icon-danger.svg";
import axios from "axios";
import { getToken, saveOffline, verifyAttendance } from "store/db";
import isReachable from "is-reachable";
import SendOffline from "offline";

const NotAttending = ({
  event,
  showModal,
  data,
  scanAllowed,
  showError,
  showSuccess,
  setUpdateAtt,
}: {
  event: any;
  showModal: any;
  data: any;
  setUpdateAtt: any;
  scanAllowed: any;
  showError: any;
  showSuccess: any;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const register = async () => {
    setLoading(true);
    if (await isReachable(process.env.REACT_APP_API_BASE_URL!)) {
      await SendOffline();
      const token = await getToken();
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/pwa/attendance/${data.id}/verify`,
          {verified_at: new Date().toISOString()},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(async function (response) {
          await verifyAttendance(data.id);
          setUpdateAtt(data.id);
          showSuccess(true);
          setLoading(false);
          showModal(false);
        })
        .catch(function (error) {
          if (error.response.data.error) {
            if (error.response.data.error.includes("already")) {
              showError(true);
              setLoading(false);
              showModal(false);
            }
          }
          setLoading(false);
          showModal(false);
        });
    } else {
      await verifyAttendance(data.id);
      const offlineData = {
        id: data.id,
        status: "verify",
      };
      await saveOffline(offlineData);
      setUpdateAtt(data.id);
      showSuccess(true);
      setLoading(false);
      showModal(false);
    }
  };

  const handleClose = () => {
    scanAllowed(true);
    showModal(false);
  };

  useLayoutEffect(() => {
    let audio = new Audio("/ES_Multimedia Prompt 765 - SFX Producer.mp3");
    audio.play();
  }, []);

  return (
    <div className="notAttendingModal">
      <div className="notAttendingModal__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>Dalībniekam pieteikts kavējums!</h3>
        <p>{data != undefined ? `${data.full_name}, ${data.class_name}` : ""}</p>
        <div className="events">
          <div className="lunchSeries">
            <h4 className="lunchTitle">{event.service_series_name}</h4>
            <span>Pieteikts kavējums</span>
          </div>
          <Button
            disabled={loading}
            title="Reģistrēt apmeklējumu"
            type="green"
            iconArrow={undefined}
            iconLogOut={undefined}
            onClick={register}
            iconPersonalQR={undefined}
          />
        </div>
        <Button
          disabled={false}
          title="Personīgais QR kods"
          type="fiolBordered"
          iconArrow={false}
          iconLogOut={undefined}
          onClick={handleClose}
          iconPersonalQR={true}
        />
        <Button
          disabled={false}
          title="Atcelt"
          type="not"
          iconArrow={false}
          iconLogOut={undefined}
          onClick={handleClose}
          iconPersonalQR={false}
        />
      </div>
    </div>
  );
};

export default NotAttending;
