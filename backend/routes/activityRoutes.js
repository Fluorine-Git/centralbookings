const express = require('express');
const router = express.Router();
const db = require('../config/db');

function formatSixDigitId(id) {
  return String(id).padStart(6, '0');
}

function parseExpectedParticipants(rawValue) {
  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    return { value: 0, error: null };
  }

  if (typeof rawValue === 'boolean') {
    return { value: null, error: 'expected_participants must be a non-negative integer' };
  }

  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return { value: null, error: 'expected_participants must be a non-negative integer' };
  }

  return { value: parsed, error: null };
}

function getMissingFields(body, requiredFields) {
  return requiredFields.filter((field) => {
    const val = body?.[field];
    return val === undefined || val === null || String(val).trim() === '';
  });
}

// GET /api/activities
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        LPAD(a.activity_id, 6, '0') AS activity_id,
        o.organizer_name AS organizer,
        a.activity_title AS activity,
        l.location_name AS location,
        s.schedule_date AS date,
        s.schedule_start_time AS start_time,
        s.schedule_end_time AS end_time,
        a.expected_participants AS expected_participants
      FROM ACTIVITY a
      LEFT JOIN ORGANIZER o
        ON a.organizer_id = o.organizer_id
      LEFT JOIN ACTIVITY_SCHEDULE s
        ON a.activity_id = s.activity_id
      LEFT JOIN LOCATION l
        ON s.location_id = l.location_id
      ORDER BY s.schedule_date ASC, s.schedule_start_time ASC, a.activity_id ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching activities:', err.message);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// POST /api/activities
router.post('/', async (req, res) => {
  const missing = getMissingFields(req.body, ['activity_title', 'activity_description']);
  if (missing.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missing.join(', ')}`
    });
  }

  const { value: expectedParticipants, error: participantsError } = parseExpectedParticipants(
    req.body.expected_participants
  );
  if (participantsError) {
    return res.status(400).json({ error: participantsError });
  }

  const rawOrganizerId = req.body.organizer_id;
  const hasOrganizerId =
    rawOrganizerId !== undefined &&
    rawOrganizerId !== null &&
    String(rawOrganizerId).trim() !== '';
  
  const organizerId = hasOrganizerId ? Number(rawOrganizerId) : null;

  if (
    hasOrganizerId &&
    (typeof rawOrganizerId === 'boolean' || !Number.isInteger(organizerId) || organizerId <= 0)
  ) {
    return res.status(400).json({
      error: 'organizer_id must be a positive integer'
    });
  }

  const title = String(req.body.activity_title).trim();
  const description = String(req.body.activity_description).trim();

  try {
    const [result] = await db.query(
      `
      INSERT INTO ACTIVITY (
        organizer_id,
        activity_title,
        activity_description,
        expected_participants
      ) VALUES (?, ?, ?, ?)
      `,
      [organizerId, title, description, expectedParticipants]
    );

    const formattedId = formatSixDigitId(result.insertId);
    const activity = {
      activity_id: formattedId,
      organizer_id: organizerId,
      activity_title: title,
      activity_description: description,
      expected_participants: expectedParticipants
    };

    res.status(201).json({
      message: 'Activity created successfully!',
      activity_id: formattedId,
      activity
    });
  } catch (err) {
    console.error('Error creating activity:', err.message);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

module.exports = router;