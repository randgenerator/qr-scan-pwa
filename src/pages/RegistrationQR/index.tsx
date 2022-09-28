import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import QrReader from 'react-qr-reader-es6';
import { getToken, getSelectedEvents, getEvents, getAttendance, getConfig, verifyAttendance } from "store/db";

import Modal from "components/modal";
import axios from "axios";

const RegistrationQR = () => {
  const [attendances, setAttendances] = useState<any>([])
  const [scannedAttendee, setScannedAttendee] = useState<any>({})
  const [scannedAttendeeMultiple, setScannedAttendeeMultiple] = useState<any>([])
  const [selectedEvents, setSelectedEvents] = useState<any>([])
  const [showVerified, setShowVerified] = useState<boolean>(false)
  const [showAlreadyVerified, setShowAlreadyVerified] = useState<boolean>(false)
  const [showNotFound, setShowNotFound] = useState<boolean>(false)
  const [showSeveral, setShowSeveral] = useState<boolean>(false)
  const [scanAllowed, setScanAllowed] = useState<boolean>(true)
  const [continious, setContinious] = useState<any>(true)

	const handleError = (err: any) => {
		console.log(err)
	}

	const handleScan = async (result: any) => {
		if(result){
      const path = new URL(result).pathname
      const pathnames = path.split("/")
      const attendee = attendances.filter((att: any) => att.qr_uuid === pathnames[2])
			if (attendee.length === 1) {
        setScanAllowed(false)
        const token = await getToken()
        setScannedAttendee(attendee[0])
        await axios.post(`https://pa-test.esynergy.lv/api/v1/pwa/attendance/${attendee[0].id}/verify`, {}, {
          headers: {
              'Authorization': `Bearer ${token}`
            }
        })
        .then(async function (response) {
          await verifyAttendance(attendee[0].id)
          setShowVerified(true)
        })
        .catch(function (error) {
          if (error.response.data.error) {
            if (error.response.data.error.includes("already")) {
              setShowAlreadyVerified(true)
            } else if (error.response.data.error.includes("No query results")) {
              setShowNotFound(true)
            }
          }
        })
      } else if (attendee.length > 1) {
        setScanAllowed(false)
        setScannedAttendeeMultiple(attendee)
        setScannedAttendee(attendee[0])
        setShowSeveral(true)
      } else {
        setScanAllowed(false)
        setShowNotFound(true)
      }
		}
	}

  useEffect(() => {
    const getEventsDB = async () => {
      const cont = await getConfig()
      setContinious(cont)
      const att = await getAttendance()
      const events = await getEvents()
      const selected = await getSelectedEvents()
      const selectedInt = selected?.map(ev => parseInt(ev))
      setSelectedEvents(events.filter(evt => selectedInt?.includes(evt.id)))
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

  return (
    <div className="main">
      {showVerified && <Modal.Verified 
        showModal={setShowVerified} 
        scanAllowed={setScanAllowed} 
        button={continious ? false : true} 
        buttonTitle="Scan next"
        continious={continious}
        data={`${scannedAttendee.full_name}, ${scannedAttendee.class_name}`} />}
      {showSeveral && <Modal.SeveralEvents 
        showModal={setShowSeveral} 
        scanAllowed={setScanAllowed} 
        showError={setShowAlreadyVerified} 
        showSuccess={setShowVerified} 
        events={selectedEvents} 
        attendee={scannedAttendeeMultiple} />}
      {showAlreadyVerified && <Modal.InProgress 
        showModal={setShowAlreadyVerified} 
        scanAllowed={setScanAllowed} 
        continious={continious}
        button={continious ? false : true} 
        buttonTitle="Scan next" 
        data={`${scannedAttendee.full_name}, ${scannedAttendee.class_name}`} />}
      {showNotFound && <Modal.NotFound 
        showModal={setShowNotFound} 
        scanAllowed={setScanAllowed} 
        continious={continious}
        button={continious ? false : true} 
        buttonTitle="Scan next" />}
      <div className="main__top">
        <p>
          Registering attendants for {selectedEvents.length}. <Link to="/events">Edit</Link>{" "}
        </p>
      </div>
      <div className="scanArea">
        {scanAllowed && <QrReader
                  delay={500}
                  style={previewStyle}
                  onError={handleError}
                  onScan={handleScan}
        />}
      </div>
      <div className="main__bottom">
        <button className="btn" onClick={handlePause} type="button">
          Pause registration
        </button>
      </div>
    </div>
  );
};

export default RegistrationQR;
