import React from 'react';

export default function EventPopup({ event, onClose }) {
    if (!event) return null;

    const flyerSrc = event.flyer
        ? `http://localhost:5001${event.flyer}`
        : 'http://localhost:5001/uploads/noFlyer.jpg';

    const handleImageError = (e) => {
        if (e.target.src !== 'http://localhost:5001/uploads/noFlyer.jpg') {
            e.target.src = 'http://localhost:5001/uploads/noFlyer.jpg';
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "white",
                    padding: "30px 40px",
                    borderRadius: "16px",
                    minWidth: 400,
                    maxWidth: 600,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                    position: "relative",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        border: "none",
                        background: "#f2f2f2",
                        borderRadius: "50%",
                        width: 30,
                        height: 30,
                        fontSize: 18,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                >
                    ✕
                </button>

                {/* Event details */}
                <h2 style={{ marginBottom: 10 }}>{event.title}</h2>
                <p>📅 {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}</p>
                {event.location && <p>📍 {event.location}</p>}
                {event.description && <p style={{ marginTop: 10 }}>{event.description}</p>}
                <img
                    src={flyerSrc}
                    alt={event.title}
                    onError={handleImageError}
                    style={{ maxWidth: "100%", borderRadius: 8, marginTop: 12 }}
                />
            </div>
        </div>
    );
}
