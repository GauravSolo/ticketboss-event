const db = require('../db');

async function findById(eventId) {
  const res = await db.query(
    `SELECT event_id, name, total_seats, available_seats, version
     FROM events
     WHERE event_id = $1`,
    [eventId]
  );
  return res.rows[0];
}

async function optimisticDecrement({ eventId, seats, expectedVersion, client }) {
  return client.query(
    `UPDATE events
       SET available_seats = available_seats - $1,
           version = version + 1,
           updated_at = NOW()
     WHERE event_id = $2
       AND available_seats >= $1
       AND version = $3
     RETURNING available_seats, version`,
    [seats, eventId, expectedVersion]
  );
}

async function increment({ eventId, seats, client }) {
  return client.query(
    `UPDATE events
       SET available_seats = available_seats + $1,
           version = version + 1,
           updated_at = NOW()
     WHERE event_id = $2
     RETURNING available_seats, version`,
    [seats, eventId]
  );
}

module.exports = {
  findById,
  optimisticDecrement,
  increment,
};
