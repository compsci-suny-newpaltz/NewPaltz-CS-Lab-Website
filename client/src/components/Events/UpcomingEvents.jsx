import EventCarousel from "./EventCarousel";

export default function UpcomingEvents({ events }) {
    return <EventCarousel title="Upcoming Events" events={events} />;
}
