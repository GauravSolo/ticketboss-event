const eventsRepo = require('../repositories/events.repository');

const EVENT_ID = 'node-meetup-2025';

async function getEventById(eventId) {
  return eventsRepo.findById(eventId);
}

async function optimisticDecrementSeats({ eventId, seats, expectedVersion, client }) {
  return eventsRepo.optimisticDecrement({ eventId, seats, expectedVersion, client });
}

async function incrementSeats({ eventId, seats, client }) {
  return eventsRepo.increment({ eventId, seats, client });
}

module.exports = {
  EVENT_ID,
  getEventById,
  optimisticDecrementSeats,
  incrementSeats,
};
