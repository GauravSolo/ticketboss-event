require("dotenv").config();
const express = require('express');
const app = express();
const seedDatabase = require("./dbInit");
const reservationsRoutes = require("./routes/reservations.routes")
const setupSwagger = require('./config/swagger');

setupSwagger(app);
app.use(express.json());

app.use("/reservations", reservationsRoutes);


const port = process.env.PORT || 5000;
(async ()=>{
    await seedDatabase();
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    })
})();
