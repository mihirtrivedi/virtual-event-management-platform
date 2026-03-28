import { events } from '../data/store.js';
import nodemailer from 'nodemailer';

// 1. Get all events (Public)
export const getEvents = (req, res) => {
    res.json(events);
};

// 2. Get events I am registered for (New: Dashboard logic)
export const getMyRegistrations = (req, res) => {
    const myEvents = events.filter(e => e.participants.includes(req.user.email));
    res.json(myEvents);
};

// 3. Create a new event (Organizer only)
export const createEvent = (req, res) => {
    const { date, time, description } = req.body;

    if (!date || !time || !description) {
        return res.status(400).json({ error: "Date, time, and description are required" });
    }

    const newEvent = {
        id: Date.now().toString(),
        date,
        time,
        description,
        participants: []
    };

    events.push(newEvent);
    res.status(201).json(newEvent);
};

// 4. Register for an event (Attendee)
export const registerForEvent = async (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.participants.includes(req.user.email)) {
        return res.status(400).json({ error: "Already registered" });
    }

    event.participants.push(req.user.email);

    // Async Email
    try {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: { user: testAccount.user, pass: testAccount.pass }
        });

        transporter.sendMail({
            from: '"Event System" <noreply@events.com>',
            to: req.user.email,
            subject: `Confirmed: ${event.description}`,
            text: `You are registered for ${event.date} at ${event.time}!`
        }).catch(err => console.error("Email failed:", err));
    } catch (err) {
        console.error("Mail setup error:", err);
    }

    res.json({ message: "Successfully registered" });
};

// 5. Cancel a registration (New: Management logic)
export const cancelRegistration = (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const index = event.participants.indexOf(req.user.email);
    if (index === -1) return res.status(400).json({ error: "You are not registered for this event" });

    event.participants.splice(index, 1);
    res.json({ message: "Registration cancelled successfully" });
};

// 6. Update an event (Organizer only)
export const updateEvent = (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    Object.assign(event, req.body);
    res.json(event);
};

// 7. Delete an event (Organizer only)
export const deleteEvent = (req, res) => {
    const index = events.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Event not found" });

    events.splice(index, 1);
    res.status(204).send();
};
