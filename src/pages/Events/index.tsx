import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, setSelectedEvents } from "store/db";
import "./style.scss";
import { saveEvents, saveAttendance } from "store/db";
import IconSettings from "assets/images/icon-settings.svg";
import { useNavigate } from "react-router-dom";

type Event = {
  id: number;
  name: string;
  description: string;
  status: string;
  scheduled_at: Date;
  service_series_name: string;
  school_name: string;
}

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Array<Event>>([]);
  useEffect(()=> {
    const getEvents = async () => {
        const token = await getToken()
        const evts = await axios.get("https://pa-test.esynergy.lv/api/v1/pwa/events/initiated", {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        })
        .then(function (response) {
          return response.data.events
        })
        .catch(function (error) {
          console.log(error)
        })
        console.log("evts", evts)
        setEvents(evts)
        evts.forEach(async (event: any) => {
          console.log("event is", event)
          await saveEvents(event)
          const att = await axios.get(`https://pa-test.esynergy.lv/api/v1/pwa/events/${event.id.toString()}/attendance`, {
            headers: {
                'Authorization': `Bearer ${token}`
              }
          })
          .then(function (response) {
            return response.data.attendances
          })
          .catch(function (error) {
            console.log(error)
          })
          
          att.forEach(async (attendance: any) => {
            attendance.attendance_id = event.id
            await saveAttendance(attendance)
          })
        })
    }

    getEvents()
  },[])

  const [selected, setSelected] = useState<Array<any>>([])
  useEffect(() => {
      setSelectedEvents(selected)
  }, [selected])

  const handleSubmit = (e: any) => {
    e.preventDefault();
    navigate("/registration");
  }

  const handleChange = (e: any) => {
    if (e.target.checked) {
        setSelected([...selected, e.target.value])
    } else {
        setSelected(selected.filter(event => event !== e.target.value))
    }
  }
    
  return (
    <form onSubmit={handleSubmit}>
      <div className="events">
        <div className="events__content">
          <h3 className="content-title">Select events to register attendants</h3>
          <ul className="select-events">
                {events.map((event) => {
                  return (
                    <li className="items">
                      <div className="checkbox">
                        <input type="checkbox" 
                        value={event.id} 
                        id={event.id.toString()} 
                        defaultChecked={false}
                        onChange={handleChange}
                        name="" />
                        <label htmlFor={event.id.toString()}></label>
                      </div>
                      <div className="text">
                        <h3 className="text__title ">{event.service_series_name}</h3>
                        <span className="text__caption">{event.description}</span>
                      </div>
                    </li>
                    )
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
          <div className="contentButton">
            <button className="submitButton" type="submit">
              Start registration
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Events;
