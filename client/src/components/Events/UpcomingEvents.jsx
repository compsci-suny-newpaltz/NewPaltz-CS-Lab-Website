import React from 'react';
import EventCard from './EventCard';
import EventPopup from './EventPopup';

export default function UpcomingEvents({ events }) {

    const [selectedEvent, setSelectedEvent] = React.useState(null);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Upcoming Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard key={event.id} event={event} onClick={handleEventClick} />
                    ))
                ) : (
                    <p>No upcoming events.</p>
                )}
            </div>
            {selectedEvent && (
                <EventPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}
        </div>
    );
}
