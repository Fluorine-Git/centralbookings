const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ACTIVITIES ORDER BY ACTIVITY_DATE ASC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching activities: ', err.message);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

router.post('/', async (req, res) => {
    const { organizer, activity, location, activity_date, start_time, end_time, expected_participants } = req.body;

    try {
        const query =
        `INSERT INTO ACTIVITIES (ORGANIZER, ACTIVITY, LOCATION, ACTIVITY_DATE, START_TIME, END_TIME, EXPECTED_PARTICIPANTS)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await db.query(query, [
            organizer,
            activity,
            location,
            activity_date,
            start_time,
            end_time,
            expected_participants
        ]);

        res.status(201).json({
            message: 'Activity created successfully!',
            activityId: result.insertId
        });
    } catch (err) {
        console.error('Error creating activity: ', err.message);
        res.status(500).json({ error: 'Failed to create activity' });
    }
});

module.exports = router;