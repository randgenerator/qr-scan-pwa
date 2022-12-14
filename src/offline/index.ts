import { changeSentStatus, getOffline, getToken, removeOffline } from "store/db";
import axios from "axios";
import SyncAttendance from "attendanceSync";

export const SendOffline = async () => {
  const attendance = await getOffline();
  const token = await getToken();
  attendance.forEach(async (att: any) => {
    if (att.status == "verify") {
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/pwa/attendance/${att.id}/verify`,
          {verified_at: att.attemptedTimestamp},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(async function (response) {
            await changeSentStatus(parseInt(att.id), "sent")
            await removeOffline(att.id);
        })
        .catch(async function (error) {
          if (error.response.data.error) {
            if (error.response.data.error.includes("already")) {
                await removeOffline(att.id);
            } else if (error.response.data.error.includes("No query results")) {
                await removeOffline(att.id);
            }
          }
        });
    } else {
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/pwa/attendance/${att.id}/unverify`,
          {verified_at: att.attemptedTimestamp},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(async function (response) {
          await changeSentStatus(parseInt(att.id), "sent")
          await removeOffline(att.id);
        })
        .catch(async function (error) {
          if (error.response.data.error) {
            if (error.response.data.error.includes("already")) {
                await removeOffline(att.id);
            } else if (error.response.data.error.includes("No query results")) {
                await removeOffline(att.id);
            }
          }
        });
    }
  });
  setTimeout(() => SyncAttendance(), 1000)
};

export default SendOffline;
