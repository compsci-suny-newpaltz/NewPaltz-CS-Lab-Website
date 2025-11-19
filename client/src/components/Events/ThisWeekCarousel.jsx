import React, { useRef } from 'react';
import EventCard from './EventCard';

export default function ThisWeekCarousel({ events, onEventClick }) {
    const carouselRef = useRef(null);

    const scroll = (direction) => {
        if (!carouselRef.current) return;
        const { scrollLeft, clientWidth } = carouselRef.current;
        const scrollAmount = clientWidth * 0.8; // scroll ~80% of the visible area
        carouselRef.current.scrollTo({
            left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">This Week&apos;s Events</h2>
            <div className="relative">
                {/* Left arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300"
                >
                    &#8592;
                </button>

                {/* Carousel */}
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto gap-4 pb-2 scroll-smooth scrollbar-hide"
                >
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event.id} className="flex-shrink-0 w-64">
                                <EventCard event={event} onClick={onEventClick} />
                            </div>
                        ))
                    ) : (
                        <p className="ml-4">No events this week.</p>
                    )}
                </div>

                {/* Right arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300"
                >
                    &#8594;
                </button>
            </div>
        </div>
    );
}
