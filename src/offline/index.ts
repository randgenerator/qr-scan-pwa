import { changeSentStatus, getOffline, getToken, removeOffline } from "store/db";
import axios from "axios";
import SyncAttendance from "attendanceSync";

export const SendOffline = async () => {
  const attendances:any[] = await getOffline();
  const token = await getToken();
  for (let attendance of attendances) {
        if (attendance.status == "verify") {
            await axios
                .post(
                    `${process.env.REACT_APP_API_URL}/pwa/attendance/${attendance.id}/verify`,
                    {verified_at: attendance.attemptedTimestamp},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                .then(async function (response) {
                    await changeSentStatus(parseInt(attendance.id), "sent")
                    await removeOffline(attendance.id);
                })
                .catch(async function (error) {
                    if (error.response.data.error) {
                        if (error.response.data.error.includes("already")) {
                            await removeOffline(attendance.id);
                        } else if (error.response.data.error.includes("No query results")) {
                            await removeOffline(attendance.id);
                        }
                    }
                });
        }
        else {
            await axios
                .post(
                    `${process.env.REACT_APP_API_URL}/pwa/attendance/${attendance.id}/unverify`,
                    {verified_at: attendance.attemptedTimestamp},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                .then(async function (response) {
                    await changeSentStatus(parseInt(attendance.id), "sent")
                    await removeOffline(attendance.id);
                })
                .catch(async function (error) {
                    if (error.response.data.error) {
                        if (error.response.data.error.includes("already")) {
                            await removeOffline(attendance.id);
                        } else if (error.response.data.error.includes("No query results")) {
                            await removeOffline(attendance.id);
                        }
                    }
                });
        }
    }
  await SyncAttendance()
};

export default SendOffline;
