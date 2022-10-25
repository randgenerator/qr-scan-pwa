import { openDB, DBSchema } from 'idb';

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
        scheduled_at: Date;
        service_series_name: string;
        school_name: string;
      };
      key: string;
      indexes: { 'by-id': number };
    };
    attendance: {
      value: {
        id: number;
        full_name: string;
        verified: number;
        //timestamp: string or Dsate
        //verified_time
        status: string;
        class_name: string;
        qr_uuid: string;
        attendance_id: number;
      };
      key: string;
      indexes: { 'by-id': number };
    };
    config: {
      key: string;
      value: boolean;
    };
    mode: {
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
      };
      key: string;
      indexes: { 'by-id': number };
    };
}

export async function initDb() {
    const db = await openDB<PwaDB>('pwa-db', 5, {
        upgrade(db) {
          db.createObjectStore('token');
          db.createObjectStore('selected');
          db.createObjectStore('config');
          db.createObjectStore('mode');
          const event = db.createObjectStore('events', {
            keyPath: 'id',
          });
          event.createIndex('by-id', 'id');
          const attendance = db.createObjectStore('attendance', {
            keyPath: 'id',
          });
          attendance.createIndex('by-id', 'id');
          const offline = db.createObjectStore('offline', {
            keyPath: 'id',
          });
          offline.createIndex('by-id', 'id');
        },
    });
    await db.put("mode", true, "status")
    db.close()
    await db.put("config", true, "continuous")
    db.close()
}

export async function clearDb() {
  const db = await openDB<PwaDB>('pwa-db', 5, {
    upgrade(db) {
      db.createObjectStore('token');
      db.createObjectStore('selected');
      db.createObjectStore('config');
      const event = db.createObjectStore('events', {
        keyPath: 'id',
      });
      event.createIndex('by-id', 'id');
      const attendance = db.createObjectStore('attendance', {
        keyPath: 'id',
      });
      attendance.createIndex('by-id', 'id');
      const offline = db.createObjectStore('offline', {
        keyPath: 'id',
      });
      offline.createIndex('by-id', 'id');
    },
  });
  await db.clear("events")
  await db.clear("attendance")
  await db.clear("selected")
  db.close()
}
export async function changeMode(mode: boolean) {
  const db = await openDB<PwaDB>('pwa-db', 5);

  await db.put("mode", mode, "status")
  db.close()
}

export async function getMode() {
  const db = await openDB<PwaDB>('pwa-db', 5);

  const data = await db.get("mode", "status")
  db.close()
  return data
}

export async function addToken(token: string) {
    const db = await openDB<PwaDB>('pwa-db', 5);

    await db.put("token", token, "token")
    db.close()
}

export async function getToken() {
    const db = await openDB<PwaDB>('pwa-db', 5);

    const data = await db.get("token", "token")
    db.close()
    return data
}

export async function getSelectedEvents() {
  const db = await openDB<PwaDB>('pwa-db', 5);

  const data = await db.get("selected", "events")
  db.close()
  return data
}

export async function setSelectedEvents(events: any) {
  const db = await openDB<PwaDB>('pwa-db', 5);

  await db.put("selected", events, "events")
  db.close()
}

export async function getEvents() {
  const db = await openDB<PwaDB>('pwa-db', 5);

  const data = await db.getAllFromIndex('events', 'by-id')
  db.close()
  return data
}

export async function saveEvents(event: any) {
  const db = await openDB<PwaDB>('pwa-db', 5);

  await db.add("events", event)
  db.close()
}

export async function getAttendance() {
  const db = await openDB<PwaDB>('pwa-db', 5);

  const data = await db.getAllFromIndex('attendance', 'by-id')
  db.close()
  return data
}

export async function saveAttendance(attendance: any) {
  const db = await openDB<PwaDB>('pwa-db', 5);

  await db.put("attendance", attendance)
  db.close()
}

export async function verifyAttendance(id: any) {
  const db = await openDB<PwaDB>('pwa-db', 5);
  const value = await db.getFromIndex('attendance', 'by-id', id);
  if (value) {
    value.verified = 1
    await db.put("attendance", value)
    db.close()
  }
}

export async function unverifyAttendance(id: any) {
  const db = await openDB<PwaDB>('pwa-db', 5);
  const value = await db.getFromIndex('attendance', 'by-id', id);
  if (value) {
    value.verified = 0
    await db.put("attendance", value)
    db.close()
  }
}

export async function changeConfig(toggle: boolean) {
    const db = await openDB<PwaDB>('pwa-db', 5);

    await db.put("config", toggle, "continuous")
    db.close()
}

export async function getConfig() {
    const db = await openDB<PwaDB>('pwa-db', 5);

    const data = await db.get("config", "continuous")
    db.close()
    return data
}

export async function getOffline() {
  const db = await openDB<PwaDB>('pwa-db', 5);

  const data = await db.getAllFromIndex('offline', 'by-id')
  db.close()
  return data
}

export async function saveOffline(offline: any) {
  const db = await openDB<PwaDB>('pwa-db', 5);

  await db.put("offline", offline)
  db.close()
}

export async function removeOffline(id: any) {
  const db = await openDB<PwaDB>('pwa-db', 5);

  await db.delete("offline", id)
  db.close()
}