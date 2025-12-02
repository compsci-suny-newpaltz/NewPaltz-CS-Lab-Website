import { useState, useEffect } from 'react';
import { FaRocket, FaExternalLinkAlt } from 'react-icons/fa';
import ThisWeekCarousel from '../../components/Events/ThisWeekCarousel';
import UpcomingEvents from '../../components/Events/UpcomingEvents';
import PastEvents from '../../components/Events/PastEvents';
import eventService from '../../services/eventService';

export default function EventsPage() {
    const [events, setEvents] = useState([]);

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
        alert(
            `Event Details:\n\nTitle: ${event.title}\nDescription: ${event.description || 'No description'}\n` +
            `Location: ${event.location || 'TBA'}\nStart: ${new Date(event.start_time).toLocaleString()}\n` +
            `End: ${new Date(event.end_time).toLocaleString()}`
        );
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            {/* Hackathon Banner */}
            <a
                href="https://hydra.newpaltz.edu/hackathons/"
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
            >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 via-purple-600/50 to-indigo-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm">
                                <FaRocket className="text-2xl text-white animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    Hackathons at New Paltz
                                </h2>
                                <p className="text-white/80">
                                    View past hackathons, winners, and upcoming events
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold group-hover:bg-white/30 transition-all duration-300">
                            Explore
                            <FaExternalLinkAlt className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                    </div>
                </div>
            </a>

            <ThisWeekCarousel events={thisWeekEvents} onEventClick={handleEventClick} />
            <UpcomingEvents events={upcomingEvents} onEventClick={handleEventClick} />
            <PastEvents events={pastEvents} onEventClick={handleEventClick} />
        </div>
    );
}
