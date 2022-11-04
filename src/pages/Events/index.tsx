import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, setSelectedEvents, saveEvents, saveAttendance, getEvents } from "store/db";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import isReachable from "is-reachable";
import SendOffline from "offline";

type Event = {
  id: number;
  name: string;
  description: string;
  status: string;
  scheduled_at: Date;
  service_series_name: string;
  school_name: string;
};

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Array<Event>>([]);
  useEffect(() => {
    const initEvents = async () => {
      if (await isReachable(process.env.REACT_APP_API_BASE_URL!)) {
        await SendOffline();
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
            return [];
          });
        setEvents(evts);
        evts.forEach(async (event: any) => {
          await saveEvents(event);
          const att = await axios
            .get(`${process.env.REACT_APP_API_URL}/pwa/events/${event.id.toString()}/attendance`, {
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

          att.forEach(async (attendance: any) => {
            attendance.attendance_id = event.id;
            if (attendance.verified === 1) attendance.sentStatus = "sent";
            await saveAttendance(attendance);
          });
        });
      } else {
        const evts = await getEvents();
        setEvents(evts);
      }
    };

    initEvents();
  }, []);

  const [selected, setSelected] = useState<Array<any>>([]);
  useEffect(() => {
    setSelectedEvents(selected);
  }, [selected]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    navigate("/registration");
  };

  const handleChange = (e: any) => {
    if (e.target.checked) {
      setSelected([...selected, e.target.value]);
    } else {
      setSelected(selected.filter((event) => event !== e.target.value));
    }
  };

  
  return (
    <form onSubmit={handleSubmit}>
      <div className="events">
        <div className="events__content">
          <h3 className="content-title">
            Atzīmējiet pasākumus, kuros reģistrēsiet dalībniekus. Ja neredzat pasākumus,
            pārliecinieties, ka jūsu lietotājs ir pievienots kā atbildīgais par pasākumu sēriju.
          </h3>
          <ul className="select-events">
            {events.map((event) => {
              return (
                <li className="items">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      value={event.id}
                      id={event.id.toString()}
                      defaultChecked={false}
                      onChange={handleChange}
                      name=""
                    />
                    <label htmlFor={event.id.toString()}></label>
                  </div>
                  <label className="fullWidth" htmlFor={event.id.toString()}>
                    <div className="text">
                      <h3 className="text__title ">{event.service_series_name}</h3>
                      <span className="text__caption">{event.scheduled_at.toString()}</span>
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
          <div className="contentButton">
            {selected.length > 0 && (
              <button className="submitButton" type="submit">
                Sākt reģistrāciju
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Events;
