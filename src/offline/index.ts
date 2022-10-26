import { getOffline, getToken, removeOffline } from "store/db";
import axios from "axios";

const SendOffline = async () => {
  console.log("triggered send offline data");
  const attendance = await getOffline();
  const token = await getToken();
  attendance.forEach(async (att: any) => {
    if (att.status == "verify") {
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/pwa/attendance/${att.id}/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(async function (response) {
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
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(async function (response) {
          await removeOffline(att.id);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
};

export default SendOffline;
