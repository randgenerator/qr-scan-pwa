import React from "react";
import "./style.scss";
import Button from "components/button";
import IconDanger from "assets/images/icon-danger.svg";
import axios from "axios";
import { getToken, saveOffline, verifyAttendance } from "store/db";
import isReachable from "is-reachable";

const NotAttending = ({event, showModal, data, scanAllowed, showError, showSuccess}:{event:any, showModal:any, data:any, scanAllowed:any, showError:any, showSuccess:any}) => {
  const register = async () => {
    if (await isReachable("https://pa-test.esynergy.lv")) {
      const token = await getToken()
      await axios.post(`https://pa-test.esynergy.lv/api/v1/pwa/attendance/${data.id}/verify`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
          }
      })
      .then(async function (response) {
        await verifyAttendance(data.id)
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
      showSuccess(true)
      showModal(false)
    }
    
  }

  const handleClose = () => {
    scanAllowed(true)
    showModal(false)
  }
  return (
    <div className="notAttending">
      <div className="notAttending__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>Attendant marked not attending!</h3>
        <p>{data != undefined ? `${data.full_name}, ${data.class_name}` : ""}</p>
        <div className="events">
          <div className="lunchSeries">
            <h4 className="lunchTitle">{event.service_series_name}</h4>
            <span>Not attending</span>
          </div>
          <Button title="Register attendance" type="green" iconArrow={undefined} iconLogOut={undefined} onClick={register} />
        </div>
        <Button title="Scan next" type="fiolet" iconArrow={true} iconLogOut={undefined} onClick={handleClose} />
      </div>
    </div>
  );
};

export default NotAttending;
