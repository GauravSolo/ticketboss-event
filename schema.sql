CREATE TABLE events(
	event_id VARCHAR(255) PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	total_seats INT NOT NULL,
	available_seats INT NOT NULL,
	version INT NOT NULL DEFAULT 0,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reservations(
	reservation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	event_id VARCHAR(255) NOT NULL,
	partner_id VARCHAR(100) NOT NULL,
	seats INT NOT NULL,
	status VARCHAR(20) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	FOREIGN KEY (event_id) REFERENCES events(event_id)
	ON DELETE CASCADE
);

INSERT INTO events (event_id,name, total_seats, available_seats, version)
VALUES('node-meetup-2025', 'Node.js Meet-up', 500, 500, 0);
