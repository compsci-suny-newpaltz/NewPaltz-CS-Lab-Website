import EventCarousel from "./EventCarousel";

export default function PastEventsList({ events }) {
    return <EventCarousel title="Past Events" events={events} />;
}
