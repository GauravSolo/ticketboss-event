const db = require('./db');

const EVENT_ID = 'node-meetup-2025';

async function seedDatabase(){
    try {
        console.log('Checking if event exists');
        const result = await db.query('SELECT event_id FROM events WHERE event_id = $1', [EVENT_ID]);
        if(result.rowCount == 0){
            await db.query(
                `INSERT INTO events(event_id, name, total_seats, available_seats, version)
                 VALUES($1,$2,$3,$4,$5)`,
                [EVENT_ID, 'Node.js Meet-up', 500, 500, 0]
            );
        }
    } catch (error) {
        console.log('Error while seeding database', error);
    }
}

module.exports = seedDatabase;