import React from 'react';
import EventCard from './EventCard';

export default function PastEventsList({ events, onEventClick }) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Past Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard key={event.id} event={event} onClick={onEventClick} />
                    ))
                ) : (
                    <p>No past events.</p>
                )}
            </div>
        </div>
    );
}
