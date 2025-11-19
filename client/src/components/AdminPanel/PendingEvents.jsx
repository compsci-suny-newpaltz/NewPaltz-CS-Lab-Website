// src/components/AdminPanel/PendingEvents.jsx
import React, { useEffect, useState } from "react";
import eventService from "../../services/eventService";

export default function PendingEvents() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await eventService.getPendingEvents();
            setEvents(data);
        };
        fetchEvents();
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pending Events</h2>
            {events.length === 0 && <p>No pending events.</p>}
            <ul className="space-y-2">
                {events.map(event => (
                    <li key={event.id} className="p-4 bg-gray-100 rounded-md shadow">
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-gray-600">
                            {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
