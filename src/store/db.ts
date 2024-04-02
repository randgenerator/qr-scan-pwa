import { openDB, DBSchema } from "idb";
import {store} from "./store";
import {setSelectedEventsIds} from "./redux/slices/eventSlice";
import {setAttendanceLoadedEvents as setAttendanceLoadedEventsRedux} from "./redux/slices/attendaceSlice";

interface PwaDB extends DBSchema {
  token: {
    key: string;
    value: string;
  };
  events: {
    value: {
      id: number;
      name: string;
      description: string;
      status: string;
      sentStatus: string;
      scheduled_at: Date;
      service_series_name: any;
      school_name: string;
    };
    key: string;
    indexes: { "by-id": number };
  };
  attendance: {
    value: {
      id: number;
      full_name: string;
      verified: number;
      verified_at: Date | null;
      verified_by_admin_id: number | null;
      verified_by_admin_email: string;
      status: string;
      sentStatus: string;
      attemptedTimestamp: Date,
      class_name: string;
      qr_uuid: string;
      attendance_id: number;
    };
    key: string;
    indexes: { "by-id": number };
  };
  attendanceLoadedEvents: {
    value: any;
    key: string;
    indexes: { "by-id": number };
  };
  mode: {
    key: string;
    value: boolean;
  };
  lastSync: {
    key: string;
    value: Date;
  }
  config: {
    key: string;
    value: boolean;
  };
  selected: {
    value: Array<any>;
    key: string;
  };
  offline: {
    value: {
      id: number;
      status: string;
      attemptedTimestamp: Date,
    };
    key: string;
    indexes: { "by-id": number };
  }
}

export async function initDb() {
  const db = await openDB<PwaDB>("pwa-db", 5, {
    upgrade(db) {
      db.createObjectStore("token");
      db.createObjectStore("selected");
      db.createObjectStore("config");
      db.createObjectStore("mode");
      db.createObjectStore("lastSync");

      const event = db.createObjectStore("events", {
        keyPath: "id",
      });
      event.createIndex("by-id", "id");

      const attendance = db.createObjectStore("attendance", {
        keyPath: "id",
      });
      attendance.createIndex("by-id", "id");

      const attendanceLoadedEvents = db.createObjectStore("attendanceLoadedEvents", {
        keyPath: "id",
      });
      attendanceLoadedEvents.createIndex("by-id", "id");

      const offline = db.createObjectStore("offline", {
        keyPath: "id",
      });
      offline.createIndex("by-id", "id");
    },
  });
  await db.put("config", true, "continuous");
  await db.put("mode", true, "slow");
  await db.put("lastSync", new Date(), "time")
  db.close();
}

export async function clearDb() {
  const db = await openDB<PwaDB>("pwa-db", 5, {
    upgrade(db) {
      const event = db.createObjectStore("events", {
        keyPath: "id",
      });
      event.createIndex("by-id", "id");

      const attendance = db.createObjectStore("attendance", {
        keyPath: "id",
      });
      attendance.createIndex("by-id", "id");

      const attendanceLoadedEvents = db.createObjectStore("attendanceLoadedEvents", {
        keyPath: "id",
      });
      attendanceLoadedEvents.createIndex("by-id", "id",);
    },
  });
  await db.clear("events");
  await db.clear("attendance");
  await db.clear("attendanceLoadedEvents");
  db.close();
}

export async function addToken(token: string) {
  const db = await openDB<PwaDB>("pwa-db", 5);

  await db.put("token", token, "token");
  db.close();
}

export async function getToken() {
  const db = await openDB<PwaDB>("pwa-db", 5);

  const data = await db.get("token", "token");
  db.close();
  return data;
}

export async function getSelectedEvents() {
  const db = await openDB<PwaDB>("pwa-db", 5);
  const data = await db.get("selected", "events");
  db.close();
  return data;
}

export async function setSelectedEvents(events: any) {
  const db = await openDB<PwaDB>("pwa-db", 5);
  store.dispatch(setSelectedEventsIds(events))
  await db.put("selected", events, "events");
  db.close();
}

export async function deleteSelectedEvents() {
  const db = await openDB<PwaDB>("pwa-db", 5);
  await db.delete('selected','events')
  db.close();
}


export async function getEvents() {
  const db = await openDB<PwaDB>("pwa-db", 5);

  const data = await db.getAllFromIndex("events", "by-id");
  db.close();
  return data;
}

export async function saveEvents(event: any) {
  try {
    const db = await openDB<PwaDB>("pwa-db", 5);
    await db.add("events", event);
    db.close();
  }catch (e){
    console.log(e)
  }
}

export async function getAttendance() {
  const db = await openDB<PwaDB>("pwa-db", 5);

  const data = await db.getAllFromIndex("attendance", "by-id");
  db.close();
  return data;
}

export async function saveAttendance(attendance: any) {
  const db = await openDB<PwaDB>("pwa-db", 5);
  if (attendance.verified_at) attendance.verified_at = attendance.verified_at.replace(" ", "T").concat("Z")
  await db.put("attendance", attendance);
  db.close();
}

export async function getAttendanceLoadedEvents() {
  const db = await openDB<PwaDB>("pwa-db", 5);

  const data = await db.getAllFromIndex("attendanceLoadedEvents", "by-id");
  db.close();
  return data;
}

export async function setAttendanceLoadedEvents(event: any) {
  const db = await openDB<PwaDB>("pwa-db", 5);
  await db.put("attendanceLoadedEvents", event);
  const data = await db.getAllFromIndex("attendanceLoadedEvents", "by-id");
  store.dispatch(setAttendanceLoadedEventsRedux(data))
  db.close();
}

export async function changeSentStatus(id: any, status: any) {
  const db = await openDB<PwaDB>("pwa-db", 5);
  const value = await db.getFromIndex("attendance", "by-id", id);
  
  if (value ) {
    value.sentStatus = status;
    if (status == "failed") {
      value.attemptedTimestamp = new Date()
    } else {
      value.verified_at = new Date()
    }
    await db.put("attendance", value);
    db.close();
  }
}

export async function verifyAttendance(id: any) {
  const db = await openDB<PwaDB>("pwa-db", 5);
  const value = await db.getFromIndex("attendance", "by-id", id);
  if (value) {
    value.verified = 1;
    await db.put("attendance", value);
    db.close();
  }
}

export async function unverifyAttendance(id: any) {
  const db = await openDB<PwaDB>("pwa-db", 5);
  const value = await db.getFromIndex("attendance", "by-id", id);
  if (value) {
    value.verified = 0;
    await db.put("attendance", value);
    db.close();
  }
}

export async function changeConfig(toggle: boolean) {
  const db = await openDB<PwaDB>("pwa-db", 5);

  await db.put("config", toggle, "continuous");
  db.close();
}

export async function getConfig() {
  const db = await openDB<PwaDB>("pwa-db", 5);

  const data = await db.get("config", "continuous");
  db.close();
  return data;
}

export async function changeMode(toggle: boolean) {
  const db = await openDB<PwaDB>("pwa-db", 5);

  await db.put("mode", toggle, "slow");
  db.close();
}

export async function getMode() {
  const db = await openDB<PwaDB>("pwa-db", 5);

  const data = await db.get("mode", "slow");
  db.close();
  return data;
}

export async function changeLastSync() {
  const db = await openDB<PwaDB>("pwa-db", 5);

  await db.put("lastSync", new Date(), "time");
  db.close();
}

export async function getLastSync() {
  const db = await openDB<PwaDB>("pwa-db", 5);

  const data = await db.get("lastSync", "time");
  db.close();
  return data;
}

export async function getOffline() {
  const db = await openDB<PwaDB>("pwa-db", 5);

  const data = await db.getAllFromIndex("offline", "by-id");
  db.close();
  return data;
}

export async function saveOffline(offline: any) {
  const db = await openDB<PwaDB>("pwa-db", 5);

  await db.put("offline", offline);
  db.close();
}

export async function removeOffline(id: any) {
  const db = await openDB<PwaDB>("pwa-db", 5);

  await db.delete("offline", id);
  db.close();
}
