import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  getToken,
  setSelectedEvents,
  getSelectedEvents,
  saveEvents,
  saveAttendance,
  getEvents,
  clearDb, deleteSelectedEvents, setAttendanceLoadedEvents,
} from "store/db";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import isReachable from "is-reachable";
import SendOffline from "offline";
import {RootState, store} from "../../store/store";
import {setEventsListAreLoading} from "../../store/redux/slices/eventSlice";
import {useSelector} from "react-redux";
import {setIsAttendancesLoading} from "../../store/redux/slices/attendaceSlice";
import LoadingButton from "@mui/lab/LoadingButton";

type Event = {
  id: number;
  name: string;
  description: string;
  status: string;
  scheduled_at: Date;
  service_series_name: any;
  school_name: string;
};

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Array<Event>>([]);
  const [selected, setSelected] = useState<Array<any>>([]);
  const [firstInit, setFirstInit] = useState<boolean>(true)
  const eventsListAreLoading = useSelector((state: RootState) =>state.eventSlice.eventsListAreLoading)
  const attendanceLoadedEvents = useSelector((state: RootState) =>state.attendanceSlice.attendanceLoadedEvents)
  const attendanceListAreLoaded = useSelector((state: RootState) =>state.attendanceSlice.attendanceListAreLoaded)
  const asyncAttendancesLoading = useSelector((state: RootState) =>state.attendanceSlice.asyncAttendancesLoading)

  useEffect(() => {
    const handleBeforeUnload = (event:any) => {
      deleteSelectedEvents()
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const initEvents = async () => {
      const selectedDB = await getSelectedEvents();
      if (selectedDB) {
        setSelected(selectedDB)
      }
      if (await isReachable(process.env.REACT_APP_API_BASE_URL!)) {
        store.dispatch(setEventsListAreLoading(true))
        await clearDb()
        const token = await getToken();
        const evts = await axios
          .get(`${process.env.REACT_APP_API_URL}/pwa/events/initiated`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(function (response) {
            return response.data.events;
          })
          .catch(function (error) {
            console.log(error);
            store.dispatch(setEventsListAreLoading(false))
            return [];
          });
        for (let event of evts) {
          if (event.scheduled_at)
            event.scheduled_at = event.scheduled_at
                .replace(" ", "T")
                .concat("Z");
          if(event){
            await saveEvents(event);
          }

        }
        await SendOffline();
        setEvents(evts);
        store.dispatch(setEventsListAreLoading(false))
      } else {
        const evts = await getEvents();
        setEvents(evts);
      }
    };
    initEvents();
  }, []);

  useEffect(() => {
    const checkSelected = async ()=>{
      if (!firstInit && attendanceListAreLoaded) {
        const events = await getEvents();
        const attendanceLoadedEventsIds = attendanceLoadedEvents.map((event:any)=>event.id)
        await setSelectedEvents(selected);
        const token = await getToken();
        const eventIdsForLoad = []
        for (let eventId of selected){
          if(!attendanceLoadedEventsIds.includes( Number(eventId))){
            eventIdsForLoad.push(Number(eventId))
          }
        }
        for(let eventId of eventIdsForLoad){
          await store.dispatch(setIsAttendancesLoading(true))
          let eventObj = events.find((event:any)=>{
            return event.id === eventId
          })
          if(eventObj){
            await setAttendanceLoadedEvents(eventObj)
            const att = await axios
                .get(`${process.env.REACT_APP_API_URL}/pwa/events/${eventId.toString()}/attendance`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then(function (response) {
                  return response.data.attendances;
                })
                .catch(function (error) {
                  console.log(error);
                });
            for (let attendance of att) {
              attendance.attendance_id = eventId;
              if (attendance.verified === 1) attendance.sentStatus = "sent";
              await saveAttendance(attendance);
            }
          }
          await store.dispatch(setIsAttendancesLoading(false))

        }
      } else {
        setFirstInit(false)
      }
    }
    checkSelected()
  }, [selected]);


  const handleChange = (e: any) => {
    if (e.target.checked) {
      setSelected([...selected, Number(e.target.value)]);
    } else {
      setSelected(selected.filter((event) => event !== Number(e.target.value)));
    }
  };

  return (
      <div className="events">
        <div className="events__content">
          <h3 className="content-title">
            Atzīmējiet pasākumus, kuros reģistrēsiet dalībniekus. Ja neredzat
            pasākumus, pārliecinieties, ka jūsu lietotājs ir pievienots kā
            atbildīgais par pasākumu sēriju.
          </h3>
          {
            eventsListAreLoading ? <div>Loading</div>:<ul className="select-events">
              {events.map((event) => {
                return (
                    <li key={event?.id} className="items">
                      <div className="checkbox">
                        <input
                            type="checkbox"
                            value={event.id}
                            id={event.id.toString()}
                            defaultChecked={selected.includes(event.id)}
                            onChange={handleChange}
                            name=""
                        />
                        <label htmlFor={event.id.toString()}></label>
                      </div>
                      <label className="fullWidth" htmlFor={event.id.toString()}>
                        <div className="text">
                          <h3 className="text__title ">
                            {event.service_series_name?.LV}
                          </h3>
                          <span className="text__caption">
                        {new Date(event.scheduled_at).toLocaleString("en-GB")}
                      </span>
                        </div>
                      </label>
                    </li>
                );
              })}

              {/* <li className="items">
            <div className="checkbox">
              <input type="checkbox" value="3" id="checkboxInputThree" name="" />
              <label htmlFor="checkboxInputThree"></label>
            </div>{" "}
            <div className="text">
              <h3 className="text__title ">Lunch series C</h3>
              <span className="text__caption">7A; 7B; 7C</span>
            </div>
          </li> */}
            </ul>
          }
          <div className="contentButton">
            {selected.length > 0 && (
                <LoadingButton onClick={()=>navigate("/registration")} className="submitButton" startIcon={<div></div>} loadingPosition={'start'} disabled={asyncAttendancesLoading || eventsListAreLoading}>
                  Sākt reģistrāciju
                </LoadingButton>
            )}
          </div>
        </div>
      </div>
  );
};

export default Events;
