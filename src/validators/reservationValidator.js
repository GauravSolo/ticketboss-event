const Joi = require('joi');

const reservationSchema = Joi.object({
  partnerId: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'partnerId is required',
      'string.pattern.base': 'partnerId must be alphanumeric and can include "-" or "_" only',
      'string.min': 'partnerId must be at least 3 characters long',
      'string.max': 'partnerId must not exceed 50 characters'
    }),

  seats: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .required()
    .messages({
      'number.integer': 'Seats must be number',
      'number.min': 'Seats must be minimum 1',
      'number.max': 'Seats cannot be more than 10',
      'any.required': 'Seats are required'
    })
});

const reservationIdSchema = Joi.string()
  .guid({ version: ['uuidv4'] })
  .required()
  .messages({
    'string.empty': 'Reservation ID is required',
    'string.guid': 'Reservation ID must be valid'
  });

module.exports = {
  validateReservation: (body) => reservationSchema.validate(body),
  validateReservationId: (id) => reservationIdSchema.validate(id)
};
