const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60*1000, 
  max: 10,
  message: {
    status: 429,
    error: "Too many requests",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
