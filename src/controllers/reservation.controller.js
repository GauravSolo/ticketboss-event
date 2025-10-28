const { validateReservation, validateReservationId } = require("../validators/reservationValidator");
const reservationsService = require("../services/reservations.service");
const eventsService = require("../services/events.service");

const createReservation = async (req, res) => {
  const { error } = validateReservation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { partnerId, seats } = req.body;

  try {
    const result = await reservationsService.reserveSeats({
      eventId: eventsService.EVENT_ID,
      partnerId,
      seats,
    });

    if (result.type === "NOT_FOUND") {
      return res.status(404).json({ error: "Event not found" });
    }
    if (result.type === "CONFLICT") {
      return res
        .status(409)
        .json({ error: "Not enough seats left or Try again" });
    }

    return res.status(201).json({
      reservationId: result.reservationId,
      seats: result.seats,
      status: result.status,
    });
  } catch (err) {
    console.error("Reservation error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getEventSummary = async (req, res) => {
  try {
    const event = await eventsService.getEventById(eventsService.EVENT_ID);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const reservationCount = event.total_seats - event.available_seats;

    return res.status(200).json({
      eventId: event.event_id,
      name: event.name,
      total_seats: event.total_seats,
      available_seats: event.available_seats,
      reservationCount,
      version: event.version,
    });
  } catch (err) {
    console.error("Summary error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const cancelReservation = async (req, res) => {
  const reservationId = req.params.id;
  const { error } = validateReservationId(req.params.id);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const result = await reservationsService.cancelReservation({
      reservationId,
    });

    if (result.type === "NOT_FOUND") {
      return res.status(404).json({ error: result.message });
    }
    if (result.type === "ERROR") {
      return res.status(500).json({ error: result.message });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Cancel error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createReservation,
  getEventSummary,
  cancelReservation,
};
