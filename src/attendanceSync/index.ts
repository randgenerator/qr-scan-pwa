import {
  changeLastSync,
  getEvents,
  getSelectedEvents,
  getToken,
  saveAttendance,
} from "store/db";
import axios from "axios";

const SyncAttendance = async () => {
  if (navigator.onLine) {
    const token = await getToken();
    const selected = await getSelectedEvents();
    const selectedInt = selected?.map((ev) => parseInt(ev));
    const events = await getEvents();
    const filtertedEvents = events.filter((event: any) => selectedInt?.includes(event.id));
    filtertedEvents.forEach(async (event: any) => {
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
      att?.forEach(async (attendance: any) => {
        attendance.attendance_id = event.id;
        if (attendance.verified === 1) attendance.sentStatus = "sent";
        await saveAttendance(attendance);
      });
    });
    await changeLastSync()
  }
};

export default SyncAttendance;
