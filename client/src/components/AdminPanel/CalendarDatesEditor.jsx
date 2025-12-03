import { useEffect, useState } from "react";
import schoolCalendarService from "../../services/schoolCalendarService";

export default function CalendarDatesEditor({ calendarId }) {
    const [calendar, setCalendar] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
        console.log('Loading calendar data for ID:', calendarId);
    }, [calendarId]);

    function formatDate(dateValue) {
        if (!dateValue) return "";
        return new Date(dateValue).toISOString().split("T")[0];
    }

    async function loadData() {
        const data = await schoolCalendarService.getCalendarById(calendarId);

        setCalendar({
            FallStart: formatDate(data?.FallStart),
            FallEnd: formatDate(data?.FallEnd),
            WinterStart: formatDate(data?.WinterStart),
            WinterEnd: formatDate(data?.WinterEnd),
            SpringStart: formatDate(data?.SpringStart),
            SpringEnd: formatDate(data?.SpringEnd),
            SummerStart: formatDate(data?.SummerStart),
            SummerEnd: formatDate(data?.SummerEnd),
            isDefault: data?.isDefault ?? 0,
        });
    }


    async function saveChanges() {
        setIsSaving(true);

        const cleanPayload = {
            FallStart: calendar.FallStart,
            FallEnd: calendar.FallEnd,
            WinterStart: calendar.WinterStart,
            WinterEnd: calendar.WinterEnd,
            SpringStart: calendar.SpringStart,
            SpringEnd: calendar.SpringEnd,
            SummerStart: calendar.SummerStart,
            SummerEnd: calendar.SummerEnd,
            isDefault: calendar.isDefault ?? 0,
        };

        await schoolCalendarService.editCalendar(calendarId, cleanPayload);
        setIsSaving(false);
    }

    if (!calendar) return <p>Loading…</p>;

    const fields = [
        "FallStart", "FallEnd",
        "WinterStart", "WinterEnd",
        "SpringStart", "SpringEnd",
        "SummerStart", "SummerEnd",
    ];

    return (
        <div className="p-4 border rounded-xl bg-white shadow-md">
            <h2 className="text-xl font-bold mb-4">Semester Dates</h2>

            <div className="grid grid-cols-2 gap-4">
                {fields.map(field => (
                    <div key={field}>
                        <label className="font-medium">{field}</label>
                        <input
                            type="date"
                            value={calendar[field] || ""}
                            onChange={(e) =>
                                setCalendar({ ...calendar, [field]: e.target.value })
                            }
                            className="border p-2 w-full rounded"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={saveChanges}
                disabled={isSaving}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                {isSaving ? "Saving…" : "Save Changes"}
            </button>
        </div>
    );
}
