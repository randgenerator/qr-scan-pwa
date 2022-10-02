import React, { useEffect, useState } from "react";
import Button from "components/button";
import "./style.scss";
import checkedIcon from "assets/images/icon-checked.svg";
import axios from "axios";
import { getToken, saveOffline, unverifyAttendance, verifyAttendance } from "store/db";
import isReachable from "is-reachable";

const Attendance = ({ events, attendee, showModal, showVerified, showCancelled, setUpdateAtt }:{events:any, showCancelled:any, attendee:any, showModal:any, showVerified:any, setUpdateAtt:any}) => {
  const [confirm, setConfirm] = useState<boolean>(false)

  const closeModal = () => {
    showModal(false)
  }

  const register = async (e:any) => {
    if (await isReachable("https://pa-test.esynergy.lv")) {
      const token = await getToken()
      const resp = await axios.post(`https://pa-test.esynergy.lv/api/v1/pwa/attendance/${e.target.value}/verify`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
          }
      })
      .then(async function (response) {
        return true
      })
      .catch(function (error) {
        console.log(error)
        return false
      })
      if (resp) {
        await verifyAttendance(parseInt(e.target.value))
        setUpdateAtt(e.target.value)
        showVerified(true)
        showModal(false)
      }
    } else {      
      await verifyAttendance(parseInt(e.target.value))
      const offlineData = {
        id: e.target.value,
        status: "verify"
      } 
      await saveOffline(offlineData)
      setUpdateAtt(e.target.value)
      showVerified(true)
      showModal(false)
    }
  }

  const confirmDialog = () => {
    setConfirm(true)
  }

  const cancelAttendance = async (e:any) => {
    if (await isReachable("https://pa-test.esynergy.lv")) {
      const token = await getToken()
      await axios.post(`https://pa-test.esynergy.lv/api/v1/pwa/attendance/${e.target.value}/unverify`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
          }
      })
      .then(async function (response) {
        await unverifyAttendance(parseInt(e.target.value))
        setUpdateAtt(e.target.value)
        showCancelled(true)
        showModal(false)
      })
      .catch(function (error) {
        console.log(error)
      })
    } else {
      await unverifyAttendance(parseInt(e.target.value))
      const offlineData = {
        id: e.target.value,
        status: "cancel"
      } 
      setUpdateAtt(e.target.value)
      await saveOffline(offlineData)
      showCancelled(true)
      showModal(false)  
    }
  }

  useEffect(() => {
    let audio = new Audio("/ES_Multimedia Prompt 765 - SFX Producer.mp3")
    audio.play()
  }, [])

  return (
    <div className="attendance">
      <div className="attendance__wrapper">
        <div className="head">
          <h3>{attendee[0].full_name}</h3>
          <p>{attendee[0].class_name}</p>
        </div>
        <div className="content">
          <div className="items">
            
            <div>
            {events.map((event:any) => {
              const att = attendee.find((att:any) => att.attendance_id === event.id)
              if (att) {
                return (
                  <>
                    {att.verified === 1 ? <img className="checkedIcon" src={checkedIcon} alt="checkedIcon" /> : ""}

                    <h4>{event.service_series_name}</h4>

                    {att.verified === 1 ? <span className="attendanceVerified">Attendance verified</span> : att.status.toLowerCase().includes("attending") ? <span className="attending">Attending</span> : att.status.toLowerCase().includes("cancelled") ? <span className="notattending">Not Attending</span> : <span className="attending">Attending</span>}
                    
                    {att.verified === 0 ? <Button title="Register attendance" value={att.id} type="green" iconArrow={undefined} iconLogOut={undefined} onClick={register} /> : <Button value={att.id} title={confirm ? "Confirm?" : "Cancel attendance"} type={confirm ? "red" : "redBordered"} iconArrow={undefined} iconLogOut={undefined} onClick={confirm ? cancelAttendance : confirmDialog} />}
                  
                  </>
                )
              }
            })}
            <div className="cancel"><Button title="Cancel" type="fiolBordered" iconArrow={undefined} iconLogOut={undefined} onClick={closeModal} /></div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
