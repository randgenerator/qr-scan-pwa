import {
  changeLastSync,
  getEvents,
  getSelectedEvents,
  getToken,
  saveAttendance,
  setAttendanceLoadedEvents
} from "store/db";
import axios from "axios";
import {setAttendanceListAreLoaded, setIsAttendancesLoading} from "../store/redux/slices/attendaceSlice";
import {store} from "../store/store";


const SyncAttendance = async () => {
  const requestIsSending = store.getState().attendanceSlice.asyncAttendancesLoading

  if (navigator.onLine && !requestIsSending) {
    await store.dispatch(setIsAttendancesLoading(true))
    const token = await getToken();
    const selected = await getSelectedEvents();
    const selectedInt = selected?.map((ev) => parseInt(ev));
    const events = await getEvents();
    const filtertedEvents = events.filter((event: any) => selectedInt?.includes(event.id));
    for (let event of filtertedEvents) {
      await setAttendanceLoadedEvents(event)
      try{
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
        for (let attendance of att) {
          attendance.attendance_id = event.id;
          if (attendance.verified === 1) attendance.sentStatus = "sent";
          await saveAttendance(attendance);
        }
      }catch (e) {
      }
    }
    await changeLastSync()
    await store.dispatch(setIsAttendancesLoading(false))
    await store.dispatch(setAttendanceListAreLoaded(true))
  }
};

export default SyncAttendance;
