const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'feelgood2026';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

function requireAdmin(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/api/availability', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }
  const rows = db.prepare('SELECT time FROM bookings WHERE date = ?').all(date);
  res.json({ taken: rows.map((r) => r.time) });
});

app.post('/api/bookings', (req, res) => {
  const { name, email, date, time, service } = req.body;

  if (!name || !email || !date || !time || !service) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isTaken = db
    .prepare('SELECT 1 FROM bookings WHERE date = ? AND time = ?')
    .get(date, time);

  if (isTaken) {
    return res.status(409).json({ error: 'That time slot is already booked' });
  }

  const result = db
    .prepare('INSERT INTO bookings (name, email, date, time, service) VALUES (?, ?, ?, ?, ?)')
    .run(name, email, date, time, service);

  const newBooking = { id: result.lastInsertRowid, name, email, date, time, service };
  res.status(201).json(newBooking);
});

app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  const bookings = db.prepare('SELECT * FROM bookings ORDER BY date, time').all();
  res.json(bookings);
});

app.delete('/api/admin/bookings/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});