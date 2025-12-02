import React from 'react';

export default function EventCard({ event, onClick }) {
    const handleClick = () => {
        if (onClick) onClick(event);
    };

    // Use flyer if available, fallback to default
    const flyerSrc = event.flyer_url
        ? `/api${event.flyer_url}`
        : '/api/uploads/noFlyer.jpg';

    const handleImageError = (e) => {
        if (e.target.src !== '/api/uploads/noFlyer.jpg') {
            e.target.src = '/api/uploads/noFlyer.jpg';
        }
    };

    // Pastel gradient color options
    const pastelColors = [
        "from-pink-50 to-pink-100",
        "from-blue-50 to-blue-100",
        "from-green-50 to-green-100",
        "from-yellow-50 to-yellow-100",
        "from-purple-50 to-purple-100",
        "from-orange-50 to-orange-100",
    ];

    // Stable "random" color based on event.title hashing
    const colorIndex = Math.abs(
        event.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % pastelColors.length;

    const bubbleColor = pastelColors[colorIndex];

    return (
        <div
            className={`flex flex-col items-center justify-start rounded-3xl 
                p-4 shadow-md transition-transform hover:scale-105 cursor-pointer w-64
                bg-gradient-to-br ${bubbleColor} border border-gray-200`}
            onClick={handleClick}
        >
            {/* Flyer */}
            <img
                src={flyerSrc}
                alt={event.title}
                onError={handleImageError}
                className="w-full h-40 object-cover rounded-xl mb-4"
            />

            {/* Event Info */}
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                    {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}
                </p>
            </div>
        </div>
    );
}
