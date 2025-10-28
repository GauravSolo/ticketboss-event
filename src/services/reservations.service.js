const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const eventsService = require('./events.service');
const reservationsRepo = require('../repositories/reservations.repository');

async function reserveSeats({ eventId, partnerId, seats }) {
  const event = await eventsService.getEventById(eventId);
  if (!event) return { type: 'NOT_FOUND' };

  if (event.available_seats < seats) {
    return { type: 'CONFLICT' };
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const updated = await eventsService.optimisticDecrementSeats({
      eventId,
      seats,
      expectedVersion: event.version,
      client,
    });

    if (updated.rowCount === 0) {
      await client.query('ROLLBACK');
      return { type: 'CONFLICT' };
    }

    const reservationId = uuidv4();
    await reservationsRepo.insert({
      reservationId,
      eventId,
      partnerId,
      seats,
      status: 'CONFIRMED',
      client,
    });

    await client.query('COMMIT');

    return { type: 'OK', reservationId, seats, status: 'CONFIRMED' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function cancelReservation({ reservationId }) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const rs = await reservationsRepo.findById({ reservationId, client });
    if (rs.rowCount === 0) {
      await client.query('ROLLBACK');
      return { type: 'NOT_FOUND', message: 'Reservation not found' };
    }

    const reservation = rs.rows[0];

    if (reservation.status === 'CANCELLED') {
      await client.query('ROLLBACK');
      return { type: 'NOT_FOUND', message: 'Reservation already cancelled' };
    }

    const upd = await eventsService.incrementSeats({
      eventId: reservation.event_id,
      seats: reservation.seats,
      client,
    });

    if (upd.rowCount === 0) {
      await client.query('ROLLBACK');
      return { type: 'ERROR', message: 'Unable to release seats' };
    }

    await reservationsRepo.updateStatus({
      reservationId,
      status: 'CANCELLED',
      client,
    });

    await client.query('COMMIT');
    return { type: 'OK' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  reserveSeats,
  cancelReservation,
};
