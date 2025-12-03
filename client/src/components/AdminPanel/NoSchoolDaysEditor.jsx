import { useEffect, useState } from "react";
import schoolCalendarService from "../../services/schoolCalendarService";

export default function NoSchoolDaysEditor({ calendarId }) {
    const [days, setDays] = useState([]);
    const [newDay, setNewDay] = useState("");

    useEffect(() => {
        loadDays();
    }, []);

    async function loadDays() {
        const data = await schoolCalendarService.getNoSchoolDays(calendarId);
        setDays(data);
    }

    async function addDay() {
        if (!newDay) return;
        await schoolCalendarService.addNoSchoolDay(calendarId, newDay);
        setNewDay("");
        loadDays();
    }

    async function deleteDay(id) {
        await schoolCalendarService.deleteNoSchoolDay(id);
        loadDays();
    }

    return (
        <div className="p-4 border rounded-xl bg-white shadow-md">
            <h2 className="text-xl font-bold mb-4">No School Days</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="date"
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <button onClick={addDay} className="bg-green-600 text-white px-4 py-2 rounded">
                    Add
                </button>
            </div>

            <ul className="space-y-2">
                {days.map(d => (
                    <li key={d.id} className="flex justify-between items-center border p-2 rounded">
                        <span>{d.Day}</span>
                        <button
                            onClick={() => deleteDay(d.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
