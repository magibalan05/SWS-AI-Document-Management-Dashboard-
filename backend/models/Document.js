const { getDB } = require("../config/db");

const Document = {
  create: async (data) => {
    const db = getDB();
    const result = await db.run(
      'INSERT INTO documents (filename, filesize, filepath, status) VALUES (?, ?, ?, ?)',
      [data.filename, data.filesize, data.filepath, data.status || 'Completed']
    );
    return { _id: result.lastID, ...data };
  },
  find: async () => {
    const db = getDB();
    const docs = await db.all('SELECT id as _id, * FROM documents ORDER BY uploadDate DESC');
    return docs;
  },
  findById: async (id) => {
    const db = getDB();
    return await db.get('SELECT id as _id, * FROM documents WHERE id = ?', [id]);
  }
};

module.exports = Document;
