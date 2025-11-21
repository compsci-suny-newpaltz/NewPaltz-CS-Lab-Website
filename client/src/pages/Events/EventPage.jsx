import React, { useState, useEffect } from 'react';
import ThisWeekCarousel from '../../components/Events/ThisWeekCarousel';
import UpcomingEvents from '../../components/Events/UpcomingEvents';
import PastEvents from '../../components/Events/PastEvents';
import eventService from '../../services/eventService';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await eventService.getAllEvents();
                console.log('Fetched events:', eventsData);
                setEvents(Array.isArray(eventsData) ? eventsData : [eventsData]);
            } catch (err) {
                console.error('Error fetching events:', err);
                setEvents([]);
            }
        };

        fetchEvents();
    }, []);

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

    const thisWeekEvents = events.filter((e) => {
        const start = new Date(e.start_time);
        return start >= startOfWeek && start <= endOfWeek;
    });

    const upcomingEvents = events.filter((e) => new Date(e.start_time) > endOfWeek);
    const pastEvents = events.filter((e) => new Date(e.end_time) < startOfWeek);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        alert(
            `Event Details:\n\nTitle: ${event.title}\nDescription: ${event.description || 'No description'}\n` +
            `Location: ${event.location || 'TBA'}\nStart: ${new Date(event.start_time).toLocaleString()}\n` +
            `End: ${new Date(event.end_time).toLocaleString()}`
        );
    };

    return (
        <div className="p-6 space-y-8">
            <ThisWeekCarousel events={thisWeekEvents} onEventClick={handleEventClick} />
            <UpcomingEvents events={upcomingEvents} onEventClick={handleEventClick} />
            <PastEvents events={pastEvents} onEventClick={handleEventClick} />
        </div>
    );
}
