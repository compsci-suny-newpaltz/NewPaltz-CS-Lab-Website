import { useEffect, useState } from "react";
import facultyService from "../../../services/facultyService";

const DAYS = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
    // Add Saturday/Sunday if needed
];

export default function OfficeHoursEditorPage() {
    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        const load = async () => {
            try {
                const data = await facultyService.getAllFaculty();

                // Parse existing office hours into structured form
                const parsed = data.map(f => ({
                    ...f,
                    parsedHours: parseOfficeHoursString(f.office_hours || "")
                }));

                setFacultyList(parsed);
            } catch (err) {
                console.error("Failed to load faculty:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Convert "Monday 3-5 PM, Tuesday 1-3 PM" → structured object
    const parseOfficeHoursString = (str) => {
        const map = {};
        DAYS.forEach(d => (map[d] = { start: "", end: "" }));

        const parts = str.split(",").map(p => p.trim());
        parts.forEach(part => {
            for (const day of DAYS) {
                if (part.startsWith(day)) {
                    const time = part.replace(day, "").trim();
                    const [start, end] = time.split("-").map(t => t.trim());
                    map[day] = { start, end };
                }
            }
        });

        return map;
    };

    // Convert structured object → "Monday 3-5 PM, Tuesday 1-3 PM"
    const buildOfficeHoursString = (obj) => {
        return DAYS
            .map(day => {
                const { start, end } = obj[day];
                if (!start || !end) return null;
                return `${day} ${start} - ${end}`;
            })
            .filter(Boolean)
            .join(", ");
    };

    const handleChange = (facultyId, day, field, value) => {
        setFacultyList(prev =>
            prev.map(f =>
                f.id === facultyId
                    ? {
                        ...f,
                        parsedHours: {
                            ...f.parsedHours,
                            [day]: { ...f.parsedHours[day], [field]: value }
                        }
                    }
                    : f
            )
        );
    };

    const saveOne = async (faculty) => {
        setSavingId(faculty.id);
        setMessages({});

        // Convert structured hours → final string
        const finalString = buildOfficeHoursString(faculty.parsedHours);

        try {
            await facultyService.updateFacultyOfficeHours(faculty.id, finalString);
            setMessages({ [faculty.id]: "Saved!" });
        } catch {
            setMessages({ [faculty.id]: "Error saving!" });
        } finally {
            setSavingId(null);
        }
    };

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Faculty Office Hours Editor</h1>

            <div className="space-y-10">
                {facultyList.map(f => (
                    <div key={f.id} className="p-4 border rounded-lg bg-white shadow">
                        <h3 className="text-xl font-semibold mb-4">
                            {f.name}
                            <span className="text-gray-500 text-sm ml-2">({f.role})</span>
                        </h3>

                        {/* Day-by-day schedule */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {DAYS.map(day => (
                                <div key={day} className="border p-3 rounded-md bg-gray-50">
                                    <p className="font-semibold mb-2">{day}</p>

                                    <div className="flex gap-3 items-center">
                                        <input
                                            type="text"
                                            placeholder="Start (e.g. 3 PM)"
                                            className="border p-2 rounded w-1/2"
                                            value={f.parsedHours[day].start}
                                            onChange={e =>
                                                handleChange(f.id, day, "start", e.target.value)
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="End (e.g. 5 PM)"
                                            className="border p-2 rounded w-1/2"
                                            value={f.parsedHours[day].end}
                                            onChange={e =>
                                                handleChange(f.id, day, "end", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Save button */}
                        <div className="mt-4 flex items-center gap-3">
                            <button
                                onClick={() => saveOne(f)}
                                disabled={savingId === f.id}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {savingId === f.id ? "Saving..." : "Save"}
                            </button>

                            {messages[f.id] && (
                                <span
                                    className={
                                        messages[f.id].includes("Error")
                                            ? "text-red-600"
                                            : "text-green-600"
                                    }
                                >
                                    {messages[f.id]}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
