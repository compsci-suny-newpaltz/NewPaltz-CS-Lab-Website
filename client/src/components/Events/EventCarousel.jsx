import React, { useRef, useState, useEffect } from "react";
import EventCard from "./EventCard";
import EventPopup from "./EventPopup";

export default function EventCarousel({ title, events }) {
    const carouselRef = useRef(null);
    const containerRef = useRef(null);
    const autoScrollRef = useRef(null);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleEventClick = (event) => setSelectedEvent(event);

    const scroll = (direction) => {
        if (!carouselRef.current) return;
        const amount = 600;

        carouselRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    // ⚡ FIXED: Manual wheel handler (non-passive)
    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;

        const wheelHandler = (e) => {
            e.preventDefault(); // allowed now
            el.scrollLeft += e.deltaY * 2;
        };

        el.addEventListener("wheel", wheelHandler, { passive: false });

        return () => el.removeEventListener("wheel", wheelHandler);
    }, []);

    // Auto scroll on edges
    const handleMouseMoveContainer = (e) => {
        if (!containerRef.current || !carouselRef.current || isDragging) return;

        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const width = rect.width;

        const edgeZone = width * 0.15;
        const maxSpeed = 30;

        stopAutoScroll();

        if (mouseX < edgeZone) {
            const intensity = 1 - mouseX / edgeZone;
            startAutoScroll(-maxSpeed * intensity);
        } else if (mouseX > width - edgeZone) {
            const intensity = (mouseX - (width - edgeZone)) / edgeZone;
            startAutoScroll(maxSpeed * intensity);
        }
    };

    const startAutoScroll = (speed) => {
        const loop = () => {
            if (carouselRef.current) {
                carouselRef.current.scrollLeft += speed;
                autoScrollRef.current = requestAnimationFrame(loop);
            }
        };
        autoScrollRef.current = requestAnimationFrame(loop);
    };

    const stopAutoScroll = () => {
        if (autoScrollRef.current) {
            cancelAnimationFrame(autoScrollRef.current);
            autoScrollRef.current = null;
        }
    };

    // Dragging
    const handleMouseDown = (e) => {
        stopAutoScroll();
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleMouseLeave = () => {
        setIsDragging(false);
        stopAutoScroll();
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    useEffect(() => {
        return () => stopAutoScroll();
    }, []);

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">{title}</h2>

            <div
                ref={containerRef}
                className="relative group/carousel px-8"
                onMouseMove={handleMouseMoveContainer}
                onMouseLeave={handleMouseLeave}
            >
                {/* Left Button */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12
                               bg-white/95 backdrop-blur-md rounded-full shadow-lg
                               flex items-center justify-center transition-all duration-300
                               hover:bg-white hover:scale-110 hover:shadow-xl
                               opacity-0 group-hover/carousel:opacity-100
                               border border-gray-200"
                >
                    ←
                </button>

                {/* Carousel */}
                <div
                    ref={carouselRef}
                    className={`flex gap-4 overflow-x-auto carousel-container pb-4 pt-2 px-2 scrollbar-hide 
                               cursor-grab ${isDragging ? "cursor-grabbing" : ""}`}
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        scrollBehavior: isDragging ? "auto" : "smooth",
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {events.length ? (
                        events.map((event) => (
                            <div key={event.id} className="flex-shrink-0 w-[20rem]">
                                <EventCard
                                    event={event}
                                    onClick={() => handleEventClick(event)}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="ml-4">No events.</p>
                    )}
                </div>

                {/* Right Button */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12
                               bg-white/95 backdrop-blur-md rounded-full shadow-lg
                               flex items-center justify-center transition-all duration-300
                               hover:bg-white hover:scale-110 hover:shadow-xl
                               opacity-0 group-hover/carousel:opacity-100
                               border border-gray-200"
                >
                    →
                </button>

                {/* Edge Gradients */}
                <div className="absolute left-8 top-0 bottom-4 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                <div className="absolute right-8 top-0 bottom-4 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>

            {selectedEvent && (
                <EventPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}
        </div>
    );
}
