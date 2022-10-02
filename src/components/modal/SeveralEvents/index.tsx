import React, { useEffect, useState } from "react";
import "./style.scss";
import IconDanger from "assets/images/icon-danger.svg";
import axios from "axios";
import { getToken, saveOffline, unverifyAttendance, verifyAttendance } from "store/db";
import isReachable from "is-reachable";
import Button from "components/button";

const SeveralEvents = ({events, attendee, showModal, showError, multiple, scanAllowed, showSuccess, setUpdateAtt}:{events:any, multiple:any, setUpdateAtt:any, attendee:any, showModal:any, showError: any, scanAllowed:any, showSuccess: any}) => {
  const [confirm, setConfirm] = useState<boolean>(false)

  const handleRegister = async (e:any) => {
    const id = e.target.value
    if (await isReachable("https://pa-test.esynergy.lv")) {
      const token = await getToken()
      await axios.post(`https://pa-test.esynergy.lv/api/v1/pwa/attendance/${id}/verify`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
          }
      })
      .then(async function (response) {
        await verifyAttendance(parseInt(id))
        setUpdateAtt(parseInt(id))
        showModal(false)
        showSuccess(true)
        setTimeout(() => scanAllowed(true), 3000)
      })
      .catch(function (error) {
        if (error.response.data.error) {
          if (error.response.data.error.includes("already")) {
            showModal(false)
            showError(true)
            setTimeout(() => scanAllowed(true), 3000)
          }
        }
      })
    } else {
      await verifyAttendance(id)
      const offlineData = {
        id: id,
        status: "verify"
      } 
      await saveOffline(offlineData)
      setUpdateAtt(parseInt(id))
      showSuccess(true)
      showModal(false)
      setTimeout(() => scanAllowed(true), 3000)
    }    
  }

  const confirmDialog = () => {
    setConfirm(true)
  }

  const cancelRegister = async (e:any) => {
    const id = e.target.value
    if (await isReachable("https://pa-test.esynergy.lv")) {
      const token = await getToken()
      await axios.post(`https://pa-test.esynergy.lv/api/v1/pwa/attendance/${id}/unverify`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
          }
      })
      .then(async function (response) {
        await unverifyAttendance(parseInt(id))
        setUpdateAtt(parseInt(id))
        showModal(false)
        scanAllowed(true)
      })
      .catch(function (error) {
        console.log(error)
        showModal(false)
        scanAllowed(true)
      })
    } else {
      await unverifyAttendance(parseInt(id))
      setUpdateAtt(parseInt(id))
      const offlineData = {
        id: id,
        status: "cancel"
      } 
      await saveOffline(offlineData)
      showSuccess(true)
      showModal(false)
      setTimeout(() => scanAllowed(true), 3000)
    }    
  }

  useEffect(() => {
    let audio = new Audio("/ES_Multimedia Prompt 765 - SFX Producer.mp3")
    audio.play()
  }, [])

  return (
    <div className="severalEvents">
      <div className="severalEvents__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>{multiple ? "Attendant marked not attending!" : "Attendant marked attending several events!"}</h3>
        <p>{`${attendee[0].full_name}, ${attendee[0].class_name}`}</p>
        <div>
          {events.map((event:any) => {
            const att = attendee.find((att:any) => att.attendance_id === event.id)
            return (
              <>
              <div className="lunchSeries">
                <h4 className="lunchTitle">{event.service_series_name}</h4>
                <span className={att.verified === 1 ? "verified" : att.status.toLowerCase() == "attending" ? "attending" : "notAttending"}>{att.verified === 1 ? "Attendance verified" : att.status}</span>
              </div>
              {att.verified === 0 ? <Button value={att.id} title="Register attendance" type="green" iconArrow={undefined} iconLogOut={undefined} onClick={handleRegister} /> : <Button value={att.id} title={confirm ? "Confirm?" : "Cancel attendance"} type={confirm ? "red" : "redBordered"} iconArrow={undefined} iconLogOut={undefined} onClick={confirm ? cancelRegister : confirmDialog} />}
                  
              </>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default SeveralEvents;
