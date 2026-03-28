import express from 'express';
// Added getMyRegistrations and cancelRegistration to the import list
import {
    createEvent,
    getEvents,
    registerForEvent,
    updateEvent,
    deleteEvent,
    getMyRegistrations,
    cancelRegistration
} from '../controllers/eventController.js';
import { authenticate, isOrganizer } from '../middleware/auth.js';

const router = express.Router();

// 1. Public: View all events
router.get('/', getEvents);

// 2. Attendee: View my own registrations (Dashboard)
router.get('/my-registrations', authenticate, getMyRegistrations);

// 3. Organizer Only: Manage events
router.post('/', authenticate, isOrganizer, createEvent);
router.put('/:id', authenticate, isOrganizer, updateEvent);
router.delete('/:id', authenticate, isOrganizer, deleteEvent);

// 4. Attendee: Register for an event
router.post('/:id/register', authenticate, registerForEvent);

// 5. Attendee: Cancel my registration (Manage registrations)
router.delete('/:id/register', authenticate, cancelRegistration);

export default router;
