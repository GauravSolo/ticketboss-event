const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservation.controller");
const limiter = require('../middleware/rateLimiter');

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Reserve seats for an event
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partnerId:
 *                 type: string
 *                 example: abc-corp
 *               seats:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Reservation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservationId:
 *                   type: string
 *                 seats:
 *                   type: integer
 *                 status:
 *                   type: string
 *       400:
 *         description: Bad Request (invalid seats)
 *       409:
 *         description: Conflict (not enough seats)
 */
router.post("/", reservationController.createReservation);


/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get event summary
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Event summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eventId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 totalSeats:
 *                   type: integer
 *                 availableSeats:
 *                   type: integer
 *                 reservationCount:
 *                   type: integer
 *                 version:
 *                   type: integer
 */
router.get('/', limiter, reservationController.getEventSummary);


/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       204:
 *         description: Successfully cancelled
 *       404:
 *         description: Reservation not found
 */
router.delete('/:id', reservationController.cancelReservation);


module.exports = router;