const { getDB } = require("../config/db");

const Notification = {
  create: async (data) => {
    const db = getDB();
    const result = await db.run(
      'INSERT INTO notifications (message, type, read) VALUES (?, ?, ?)',
      [data.message, data.type, data.read ? 1 : 0]
    );
    return { _id: result.lastID, ...data };
  },
  find: async () => {
    const db = getDB();
    const notifs = await db.all('SELECT id as _id, * FROM notifications ORDER BY timestamp DESC');
    return notifs.map(n => ({ ...n, read: !!n.read }));
  },
  findByIdAndUpdate: async (id, data) => {
    const db = getDB();
    if (data.read !== undefined) {
      await db.run('UPDATE notifications SET read = ? WHERE id = ?', [data.read ? 1 : 0, id]);
    }
  },
  updateMany: async (query, data) => {
    const db = getDB();
    if (data.read !== undefined) {
      await db.run('UPDATE notifications SET read = ?', [data.read ? 1 : 0]);
    }
  }
};

module.exports = Notification;
