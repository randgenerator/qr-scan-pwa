import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import QrReader from 'react-qr-reader-es6';
import { getToken, getSelectedEvents, getEvents, getAttendance, getConfig } from "store/db";

import Modal from "components/modal";
import axios from "axios";

const RegistrationQR = () => {
  const [attendances, setAttendances] = useState<any>([])
  const [scannedAttendee, setScannedAttendee] = useState<any>({})
  const [selectedEvents, setSelectedEvents] = useState<any>([])
  const [showVerified, setShowVerified] = useState<boolean>(false)
  const [showAlreadyVerified, setShowAlreadyVerified] = useState<boolean>(false)
  const [showNotFound, setShowNotFound] = useState<boolean>(false)
  const [scanAllowed, setScanAllowed] = useState<boolean>(true)

	const handleError = (err: any) => {
		console.log(err)
	}

	const handleScan = async (result: any) => {
		if(result){
      console.log("result is", result)
      const attendee = attendances.find((att: any) => att.qr_uuid === result)
			if (attendee) {
        const token = await getToken()
        setScannedAttendee(attendee)
        await axios.post(`https://pa-test.esynergy.lv/api/v1/pwa/attendance/${attendee.id}/verify`, {}, {
          headers: {
              'Authorization': `Bearer ${token}`
            }
        })
        .then(function (response) {
          setScanAllowed(false)
          setShowVerified(true)
          setTimeout(() => setScanAllowed(true), 3000)
        })
        .catch(function (error) {
          if (error.response.data.error) {
            if (error.response.data.error.contains("already")) {
              setScanAllowed(false)
              setShowAlreadyVerified(true)
              setTimeout(() => setScanAllowed(true), 3000)
            } else if (error.response.data.error.contains("No query results")) {
              setScanAllowed(false)
              setShowNotFound(true)
              setTimeout(() => setScanAllowed(true), 3000)
            }
          }
        })
      }
		}
	}

  useEffect(() => {
    const getEventsDB = async () => {
      const att = await getAttendance()
      const selected = await getSelectedEvents()
      const selectedInt = selected?.map(ev => parseInt(ev))
      setSelectedEvents(selectedInt)
      setAttendances(att.filter(attendance => selectedInt?.includes(attendance.attendance_id)))
    }

    getEventsDB()
  }, [])

  const previewStyle = {
		height: 240,
		width: 320,
	}

  const handlePause = () => {
    setScanAllowed(!scanAllowed)
  }

  console.log(attendances)
  return (
    <div className="main">
      {showVerified && <Modal.Verified showModal={setShowVerified} button={false} buttonTitle="" data={`${scannedAttendee.full_name}, ${scannedAttendee.class_name}`} />}
      {showAlreadyVerified && <Modal.InProgress showModal={setShowAlreadyVerified} button={false} buttonTitle="Register attendance" data={`${scannedAttendee.full_name}, ${scannedAttendee.class_name}`} />}
      {showNotFound && <Modal.NotFound button={false} buttonTitle="Register attendance" />}
      <div className="main__top">
        <p>
          Registering attendants for {selectedEvents.length}. <Link to="/events">Edit</Link>{" "}
        </p>
      </div>
      {/* Area for camera feed */}
      <div className="scanArea">
        {scanAllowed && <QrReader
                  delay={5000}
                  style={previewStyle}
                  onError={handleError}
                  onScan={handleScan}
        />}
      </div>
      {/* Area for camera feed */}
      <div className="main__bottom">
        <button className="btn" onClick={handlePause} type="button">
          Pause registration
        </button>
      </div>
    </div>
  );
};

export default RegistrationQR;
