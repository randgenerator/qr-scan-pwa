import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import QrReader from "react-qr-reader-es6";
import {
  getToken,
  getSelectedEvents,
  getEvents,
  getAttendance,
  getConfig,
  getMode,
  changeSentStatus,
  verifyAttendance,
  saveOffline, setSelectedEvents as setSelectedEventsDB ,
} from "store/db";

import Modal from "components/modal";
import axios from "axios";
import isReachable from "is-reachable";
import SendOffline from "offline";
import moment from "moment";

const worker = new Worker(new URL("../../workers/thread.worker.ts", import.meta.url));

const RegistrationQR = () => {
  const [attendances, setAttendances] = useState<any>([]);
  const [scannedAttendee, setScannedAttendee] = useState<any>({});
  const [eventData, setEventData] = useState<any>({});
  const [scannedAttendeeMultiple, setScannedAttendeeMultiple] = useState<any>([]);
  const [selectedEvents, setSelectedEvents] = useState<any>([]);
  const [audioPaused, setAudioPaused] = useState<boolean>(false);
  const [showVerified, setShowVerified] = useState<boolean>(false);
  const [showAlreadyVerified, setShowAlreadyVerified] = useState<boolean>(false);
  const [showNotFound, setShowNotFound] = useState<boolean>(false);
  const [showSeveral, setShowSeveral] = useState<boolean>(false);
  const [showNotAttending, setShowNotAttending] = useState<boolean>(false);
  const [multipleCancel, setMultipleCancel] = useState<boolean>(false);
  const [scanAllowed, setScanAllowed] = useState<boolean>(true);
  const [attInitiated, setAttInitiated] = useState<boolean>(false);
  const [continious, setContinious] = useState<any>(true);
  const [updateAtt, setUpdateAtt] = useState<number>();
  const [fastMode, setFastMode] = useState<any>(true);
  const [showIsPassedAttendanceErrorModal, setShowIsPassedAttendanceErrorModal] = useState<any>(false);

  useEffect(() => {
    const listener = async ({ data }: { data: any }) => {

      if (data.type === "UPDATE_SUCCESS") {
        const selected = await getSelectedEvents();
        const selectedInt = selected?.map((ev) => parseInt(ev));
        let att: any[] = [];
        let events = []; 
        const storedAttendances = await getAttendance();
        const storedEvents = await getEvents();
        events = storedEvents.filter((evt: any) => selectedInt?.includes(evt.id));
        att = storedAttendances.filter((attendance) =>
          selectedInt?.includes(attendance.attendance_id),
        );
        await setSelectedEventsDB(selected);
        setSelectedEvents(events);
        setAttendances(att);
        if(att.length>0){
          setScanAllowed(true)
        }
      }
    };

    worker.addEventListener("message", listener);

    return () => worker.removeEventListener("message", listener);
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      worker.postMessage({ type: "UPDATE" });
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleError = (err: any) => {
    console.log(err);
  };

  const validateAttendanceDate =async (attendance:any)=>{
    try {
      const selectedEvents = await getSelectedEvents();
      const events = await getEvents();
      const selectedInt = selectedEvents?.map((ev) => parseInt(ev));
      if(selectedInt){
        const eventIdOfAttendance = selectedInt.find((eventId:any)=>eventId === attendance.attendance_id)
        const eventOfAttendance = events.find((event:any)=>event.id === eventIdOfAttendance)
        let isAttendanceDateIsToday = moment().isSame(moment(eventOfAttendance?.scheduled_at),'day')
        if(!isAttendanceDateIsToday){
          return false
        }else{
          return  true
        }
      }
    }catch (e) {
      console.log(e)
    }


  }

  const handleScan = async (result: any) => {
    if (result) {
      const path = new URL(result).pathname;
      const pathnames = path.split("/");
      //change pathnames parameter number based on qr url
      const attendee = attendances.filter((att: any) => att.qr_uuid === pathnames[2]);
      // console.log(attendee,'attendee')
      if (attendee.length === 1) {
        setScanAllowed(false);
        const token = await getToken();
        setScannedAttendee(attendee);
        if(!await validateAttendanceDate(attendee[0])){
          setShowIsPassedAttendanceErrorModal(true)
          return
        }
        if (attendee[0].status.toLowerCase().includes("cancelled")) {
          setEventData(selectedEvents.find((event: any) => event.id === attendee[0].attendance_id));
          setScanAllowed(false);
          setShowNotAttending(true);
        } else {
          if (fastMode) {
            if (attendee[0].verified == 0) {
              await verifyAttendance(attendee[0].id);
              const offlineData = {
                id: attendee[0].id,
                status: "verify",
                attemptedTimestamp: new Date(),
              };
              await saveOffline(offlineData);
              await changeSentStatus(attendee[0].id, "failed");
              setUpdateAtt(attendee[0].id);
              setShowVerified(true);
            } else {
              setShowAlreadyVerified(true);
            }
            // worker.postMessage({ type: "UPDATE" });
          } else if (await isReachable(process.env.REACT_APP_API_BASE_URL!)) {
            await SendOffline();
            await axios
              .post(
                `${process.env.REACT_APP_API_URL}/pwa/attendance/${attendee[0].id}/verify`,
                { verified_at: new Date() },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              )
              .then(async function (response) {
                await verifyAttendance(attendee[0].id);
                await changeSentStatus(attendee[0].id, "sent");
                setUpdateAtt(attendee[0].id);
                setShowVerified(true);
              })
              .catch(async function (error) {
                if (error.response.data.error) {
                  if (error.response.data.error.includes("already")) {
                    setShowAlreadyVerified(true);
                  } else if (error.response.data.error.includes("No query results")) {
                    setShowNotFound(true);
                  } else {
                    await changeSentStatus(attendee[0].id, "failed");
                  }
                }
              });
          } else {
            if (attendee[0].verified == 0) {
              await verifyAttendance(attendee[0].id);
              const offlineData = {
                id: attendee[0].id,
                status: "verify",
                attemptedTimestamp: new Date(),
              };
              await changeSentStatus(attendee[0].id, "failed");
              await saveOffline(offlineData);
              setUpdateAtt(attendee[0].id);
              setShowVerified(true);
            } else {
              setShowAlreadyVerified(true);
            }
          }
        }
      } else if (attendee.length > 1) {
        let countCancelled = 0;
        for (let att of attendee){
          await validateAttendanceDate(att)
          if (att.status.toLowerCase().includes("cancelled")) countCancelled++;
        }
        if (countCancelled > 0) {
          setMultipleCancel(true);
        } else {
          setMultipleCancel(false);
        }
        setScanAllowed(false);
        setScannedAttendeeMultiple(attendee);
        setScannedAttendee(attendee);
        setShowSeveral(true);
      } else {
        setScanAllowed(false);
        setShowNotFound(true);
      }
    }
  };

  useEffect(() => {
    if (updateAtt) {
      let newAtt = [...attendances];
      const index = attendances.findIndex((att: any) => att.id == updateAtt);
      if (newAtt[index].verified === 0) {
        newAtt[index].verified = 1;
      } else {
        newAtt[index].verified = 0;
      }
      setAttendances(newAtt);
    }
  }, [updateAtt]);

  useEffect(() => {
    const getEventsDB = async () => {
      const cont = await getConfig();
      const stat = await getMode();
      setFastMode(stat);
      const token = await getToken();
      const selected = await getSelectedEvents();
      const selectedInt = selected?.map((ev) => parseInt(ev));
      let att: any[] = [];
      let events = [];
      setContinious(cont);
      // if (await isReachable(process.env.REACT_APP_API_BASE_URL!)) {
        // await SendOffline();
      //   const evts = await axios
      //     .get(`${process.env.REACT_APP_API_URL}/pwa/events/initiated`, {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     })
      //     .then(function (response) {
      //       return response.data.events;
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     });

      //   events = evts.filter((evt: any) => selectedInt?.includes(evt.id));
      //   events.forEach(async (event: any) => {
      //     const newAtt = await axios
      //       .get(`${process.env.REACT_APP_API_URL}/pwa/events/${event.id.toString()}/attendance`, {
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //         },
      //       })
      //       .then(function (response) {
      //         return response.data.attendances;
      //       })
      //       .catch(function (error) {
      //         console.log(error);
      //       });

      //     newAtt.forEach((attendance: any) => {
      //       attendance.attendance_id = event.id;
      //       att.push(attendance);
      //     });
      //   });
      // } else {
      const storedAttendances = await getAttendance();
      const storedEvents = await getEvents();
      events = storedEvents.filter((evt: any) => selectedInt?.includes(evt.id));
      att = storedAttendances.filter((attendance) =>
        selectedInt?.includes(attendance.attendance_id),
      );
      // }
      setSelectedEvents(events);
      await setSelectedEventsDB(selected);
      setAttendances(att);
      if(att.length>0){
        setScanAllowed(true)
      }
    };

    getEventsDB();
  }, []);

  useEffect(()=>{

    const checkAttendances = async ()=>{
      if(attendances.length > 0){
        for (let att of attendances){
           if(!(await validateAttendanceDate(att))){
           setScanAllowed(false);
           setShowIsPassedAttendanceErrorModal(true)
           return;
          }
        }
      }
    }
     checkAttendances()
  },[attendances])

  useEffect(() => {
    if (!attInitiated) {
      if (attendances.length > 0) {
        setScanAllowed(true)
        setAttInitiated(true)
      }
    }
  }, [attendances])

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const handlePauseQRScanning = () => {
    setScanAllowed(false);
  };
  const handleStartQRScanning = () => {
    setScanAllowed(true);
  };

  useLayoutEffect(() => {
    if (scanAllowed) {
      let audio = new Audio("/ES_Multimedia 808 - SFX Producer.mp3");
      audio.play().catch(error => {
        setAudioPaused(true)
      });
    }
  }, [scanAllowed]);

  return (
    <div className="main">
      {audioPaused && <Modal.RefreshSound setPaused={setAudioPaused} />}
      {showNotAttending && (
        <Modal.NotAttending
          setUpdateAtt={setUpdateAtt}
          showModal={setShowNotAttending}
          scanAllowed={setScanAllowed}
          data={scannedAttendee}
          showSuccess={setShowVerified}
          showError={setShowAlreadyVerified}
          event={eventData}
        />
      )}
      {showVerified && (
        <Modal.Verified
          showModal={setShowVerified}
          scanAllowed={setScanAllowed}
          button={continious ? false : true}
          buttonTitle="Skenēt nākamo"
          continious={continious}
          data={scannedAttendee}
          personalQR={false}
        />
      )}
      {showSeveral && (
        <Modal.SeveralEvents
          multiple={multipleCancel}
          setUpdateAtt={setUpdateAtt}
          showModal={setShowSeveral}
          scanAllowed={setScanAllowed}
          showError={setShowAlreadyVerified}
          showSuccess={setShowVerified}
          events={selectedEvents}
          attendee={scannedAttendeeMultiple}
        />
      )}
      {showAlreadyVerified && (
        <Modal.InProgress
          showModal={setShowAlreadyVerified}
          scanAllowed={setScanAllowed}
          continious={continious}
          button={continious ? false : true}
          buttonTitle="Skenēt nākamo"
          data={scannedAttendee}
        />
      )}
      {showNotFound && (
        <Modal.NotFound
          showModal={setShowNotFound}
          scanAllowed={setScanAllowed}
          continious={continious}
          button={continious ? false : true}
          buttonTitle="Skenēt nākamo"
        />
      )}
      {
        showIsPassedAttendanceErrorModal && <Modal.IsPassedAttendanceErrorModal/>
      }
      <div className="main__top">
        <p>
          Tiek reģistrēti apmeklējumi {selectedEvents.length} pasākumos.{" "}
          <Link to="/events">Rediģēt</Link>{" "}
        </p>
      </div>
      <div className="scanArea">
        {(selectedEvents.length > 0 && scanAllowed) && (
          <QrReader delay={500} style={previewStyle} onError={handleError} onScan={handleScan} />
        )}
        {!scanAllowed && "Reģistrācija apturēta"}
      </div>
      <div className="main__bottom">
        {
          scanAllowed ? <button className="btn" onClick={handlePauseQRScanning} type="button">
            Apturēt reģistrāciju
          </button> : <button className="btn" onClick={handleStartQRScanning} type="button">
            Sākt reģistrāciju
          </button>
        }
      </div>
    </div>
  );
};

export default RegistrationQR;
