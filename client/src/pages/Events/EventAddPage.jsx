import React, { useState, useContext } from "react";
import eventService from "../../services/eventService";
import { AuthContext } from "../../context/authContext"; // make sure you have this context
import { Link } from "react-router-dom";

export default function EventAddPage() {
    const { user } = useContext(AuthContext); // get logged-in user's id and role

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        location: "",
        flyer: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            for (let key of ["title", "description", "start_time", "end_time", "location"]) {
                if (formData[key] != null) {
                    data.append(key, formData[key]);
                }
            }

            if (formData.flyer) {
                data.append("flyer", formData.flyer);
            }

            // Include admin_id
            data.append("admin_id", user.id);

            await eventService.createEvent(data);
            alert("Event created successfully!");
            window.location.href = "/admin-panel/events";
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event. Please try again.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-stone-800 mb-2">Create Event</h2>
            <p className="text-stone-600 p-2">
                Fill in the event details below. Once done, click "Create Event".
            </p>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
                {/* Title */}
                <div className="flex flex-col">
                    <label htmlFor="title" className="text-sm font-medium text-stone-700 mb-1">Event Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300"
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col">
                    <label htmlFor="description" className="text-sm font-medium text-stone-700 mb-1">Event Description</label>
                    <textarea
                        name="description"
                        id="description"
                        rows={6}
                        value={formData.description}
                        onChange={handleChange}
                        className="px-4 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 resize-none"
                    />
                </div>

                {/* Start Time */}
                <div className="flex flex-col">
                    <label htmlFor="start_time" className="text-sm font-medium text-stone-700 mb-1">Start Time</label>
                    <input
                        type="datetime-local"
                        name="start_time"
                        id="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300"
                    />
                </div>

                {/* End Time */}
                <div className="flex flex-col">
                    <label htmlFor="end_time" className="text-sm font-medium text-stone-700 mb-1">End Time</label>
                    <input
                        type="datetime-local"
                        name="end_time"
                        id="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300"
                    />
                </div>

                {/* Location */}
                <div className="flex flex-col">
                    <label htmlFor="location" className="text-sm font-medium text-stone-700 mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="px-4 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300"
                    />
                </div>

                {/* Flyer */}
                <div className="flex flex-col">
                    <label htmlFor="flyer" className="text-sm font-medium text-stone-700 mb-1">Event Flyer</label>
                    <input
                        type="file"
                        name="flyer"
                        id="flyer"
                        accept="image/*"
                        onChange={handleChange}
                        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    />
                    {formData.flyer && <p className="text-xs text-stone-600 mt-1">Selected: {formData.flyer.name}</p>}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-300 text-white rounded-md hover:bg-blue-400 transition font-medium"
                >
                    <Link to="/admin-panel">Create Event</Link>
                </button>
            </form>
        </div>
    );
}
