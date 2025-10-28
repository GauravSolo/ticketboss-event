async function insert({ reservationId, eventId, partnerId, seats, status, client }) {
  return client.query(
    `INSERT INTO reservations(reservation_id, event_id, partner_id, seats, status)
     VALUES($1, $2, $3, $4, $5)`,
    [reservationId, eventId, partnerId, seats, status]
  );
}

async function findById({ reservationId, client }) {
  return client.query(
    `SELECT reservation_id, event_id, seats, status
     FROM reservations
     WHERE reservation_id = $1`,
    [reservationId]
  );
}

async function updateStatus({ reservationId, status, client }) {
  return client.query(
    `UPDATE reservations
       SET status = $1,
           updated_at = NOW()
     WHERE reservation_id = $2`,
    [status, reservationId]
  );
}

module.exports = {
  insert,
  findById,
  updateStatus,
};
