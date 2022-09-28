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
    selected: {
      value: Array<any>;
      key: string;
    };
}

export async function initDb() {
    const db = await openDB<PwaDB>('pwa-db', 1, {
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
        },
    });

    await db.put("config", true, "continuous")
}

export async function clearDb() {
  await openDB<PwaDB>('pwa-db', 1, {
    upgrade(db) {
      db.deleteObjectStore('selected');
      db.deleteObjectStore('events');
      db.deleteObjectStore('attendance');
    },
});
}

export async function addToken(token: string) {
    const db = await openDB<PwaDB>('pwa-db', 1, {
        upgrade(db) {
          db.createObjectStore('token');
        }
    });

    await db.put("token", token, "token")
}

export async function getToken() {
    const db = await openDB<PwaDB>('pwa-db', 1, {
        upgrade(db) {
          db.createObjectStore('token');
        }
    });

    return await db.get("token", "token")
}

export async function getSelectedEvents() {
  const db = await openDB<PwaDB>('pwa-db', 1, {
      upgrade(db) {
        db.createObjectStore('selected');
      }
  });

  return await db.get("selected", "events")
}

export async function setSelectedEvents(events: any) {
  const db = await openDB<PwaDB>('pwa-db', 1, {
    upgrade(db) {
      db.createObjectStore('selected');
    }
  });

  await db.put("selected", events, "events")
}

export async function getEvents() {
  const db = await openDB<PwaDB>('pwa-db', 1, {
      upgrade(db) {
        db.createObjectStore('events');
      }
  });

  return await db.getAllFromIndex('events', 'by-id')
}

export async function saveEvents(event: any) {
  const db = await openDB<PwaDB>('pwa-db', 1, {
    upgrade(db) {
      db.createObjectStore('events');
    }
  });

  await db.add("events", event)
}

export async function getAttendance() {
  const db = await openDB<PwaDB>('pwa-db', 1, {
      upgrade(db) {
        db.createObjectStore('attendance');
      }
  });

  return await db.getAllFromIndex('attendance', 'by-id')
}

export async function saveAttendance(attendance: any) {
  const db = await openDB<PwaDB>('pwa-db', 1, {
    upgrade(db) {
      db.createObjectStore('attendance');
    }
  });

  await db.add("attendance", attendance)
}

export async function verifyAttendance(id: any) {
  const db = await openDB<PwaDB>('pwa-db', 1);
  const tx = db.transaction('attendance', 'readwrite');
  const index = tx.store.index('by-id');

  for await (const cursor of index.iterate(id)) {
    const attendant = { ...cursor.value };
    attendant.verified = 1;
    cursor.update(attendant);
  }
  await tx.done;
}

export async function unverifyAttendance(id: any) {
  const db = await openDB<PwaDB>('pwa-db', 1);
  const tx = db.transaction('attendance', 'readwrite');
  const index = tx.store.index('by-id');

  for await (const cursor of index.iterate(id)) {
    const attendant = { ...cursor.value };
    attendant.verified = 0;
    cursor.update(attendant);
  }
  await tx.done;
}

export async function changeConfig(toggle: boolean) {
    const db = await openDB<PwaDB>('pwa-db', 1, {
        upgrade(db) {
          db.createObjectStore('config');
        }
    });

    await db.put("config", toggle, "continuous")
}

export async function getConfig() {
    const db = await openDB<PwaDB>('pwa-db', 1, {
        upgrade(db) {
          db.createObjectStore('config');
        }
    });

    return await db.get("config", "continuous")
}