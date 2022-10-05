import React, { useEffect } from "react";
import "./style.scss";
import Button from "components/button";
import IconDanger from "assets/images/icon-danger.svg";
import axios from "axios";
import { getToken, saveOffline, verifyAttendance } from "store/db";
import isReachable from "is-reachable";

const NotAttending = ({event, showModal, data, scanAllowed, showError, showSuccess, setUpdateAtt}:{event:any, showModal:any, data:any, setUpdateAtt:any, scanAllowed:any, showError:any, showSuccess:any}) => {
  const register = async () => {
    if (await isReachable(process.env.REACT_APP_API_BASE_URL!)) {
      const token = await getToken()
      await axios.post(`${process.env.REACT_APP_API_URL}/pwa/attendance/${data.id}/verify`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
          }
      })
      .then(async function (response) {
        await verifyAttendance(data.id)
        setUpdateAtt(data.id)
        showSuccess(true)
        showModal(false)
      })
      .catch(function (error) {
        if (error.response.data.error) {
          if (error.response.data.error.includes("already")) {
            showError(true)
            showModal(false)
          }
        }
        showModal(false)
      })
    } else {
      await verifyAttendance(data.id)
      const offlineData = {
        id: data.id,
        status: "verify"
      } 
      await saveOffline(offlineData)
      setUpdateAtt(data.id)
      showSuccess(true)
      showModal(false)
    }
    
  }

  const handleClose = () => {
    scanAllowed(true)
    showModal(false)
  }

  useEffect(() => {
    let audio = new Audio("/ES_Multimedia Prompt 765 - SFX Producer.mp3")
    audio.play()
  }, [])

  return (
    <div className="notAttending">
      <div className="notAttending__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>Attendant marked not attending!</h3>
        <p>{data != undefined ? `${data.full_name}, ${data.class_name}` : ""}</p>
        <div className="events">
          <div className="lunchSeries">
            <h4 className="lunchTitle">{event.service_series_name}</h4>
            <span>Pieteikts kavējums</span>
          </div>
          <Button title="Reģistrēt apmeklējumu" type="green" iconArrow={undefined} iconLogOut={undefined} onClick={register} />
        </div>
        <Button title="Skenēt nākamo" type="fiolet" iconArrow={true} iconLogOut={undefined} onClick={handleClose} />
      </div>
    </div>
  );
};

export default NotAttending;
