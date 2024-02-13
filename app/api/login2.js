

import nextConnect from 'next-connect';
import sqlite3 from 'sqlite3';

const handler = nextConnect();

handler.post(async (req, res) => {
  const { username, password } = req.body;

  let db = new sqlite3.Database('./accounts.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
  db.get(`SELECT * FROM accounts WHERE username = ? AND password = ?`, [username, password], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ success: false });
    } else if (row) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

export default handler;