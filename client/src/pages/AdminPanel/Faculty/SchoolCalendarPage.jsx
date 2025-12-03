import { useEffect, useState } from "react";
import CalendarDatesEditor from "../../../components/AdminPanel/CalendarDatesEditor";
import NoSchoolDaysEditor from "../../../components/AdminPanel/NoSchoolDaysEditor";
import FacultySemesterEditor from "../../../components/AdminPanel/FacultySemesterEditor";
import schoolCalendarService from "../../../services/schoolCalendarService";

export default function SchoolCalendarPage() {
    const [calendarList, setCalendarList] = useState([]);
    const [selectedCalendarId, setSelectedCalendarId] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const defaultCalendar = {
        FallStart: null,
        FallEnd: null,
        WinterStart: null,
        WinterEnd: null,
        SpringStart: null,
        SpringEnd: null,
        SummerStart: null,
        SummerEnd: null
    };

    useEffect(() => {
        loadCalendars();
    }, []);

    async function loadCalendars() {
        setIsLoading(true);

        let data = await schoolCalendarService.getAllCalendars();

        if (!Array.isArray(data)) {
            console.warn("Calendar API did NOT return an array.", data);
            data = [];
        }

        // If none exist, auto-create one
        if (data.length === 0) {
            const newCalendar = await schoolCalendarService.addCalendar(defaultCalendar);
            const calendarWithData = { id: newCalendar.id, isDefault: 1, ...defaultCalendar };
            setCalendarList([calendarWithData]);
            setSelectedCalendarId(calendarWithData.id);
            setIsLoading(false);
            return;
        }

        setCalendarList(data);

        // Select default calendar first
        const defaultCal = data.find(c => c.isDefault === 1);
        setSelectedCalendarId(defaultCal ? defaultCal.id : data[0].id);

        setIsLoading(false);
    }

    async function setAsDefault() {
        await schoolCalendarService.setDefaultCalendar(selectedCalendarId);
        await loadCalendars(); // reload list to reflect default
    }

    if (isLoading) return <p>Loading...</p>;

    const selectedCal = calendarList.find(c => c.id === Number(selectedCalendarId));

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold mb-4">School Calendar Management</h1>

            {/* Calendar Selector */}
            <div className="mb-4">
                <label className="font-semibold mr-3">Select Calendar:</label>
                <select
                    value={selectedCalendarId}
                    onChange={(e) => setSelectedCalendarId(e.target.value)}
                    className="border rounded p-2"
                >
                    {calendarList.map((cal) => (
                        <option key={cal.id} value={cal.id}>
                            Calendar #{cal.id} {cal.isDefault ? " (Default)" : ""}
                        </option>
                    ))}
                </select>
            </div>

            {/* Set Default Button */}
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded shadow"
                onClick={setAsDefault}
                disabled={selectedCal?.isDefault === 1}
            >
                {selectedCal?.isDefault ? "This is the Default Calendar" : "Set as Default Calendar"}
            </button>

            <section>
                <CalendarDatesEditor calendarId={selectedCalendarId} />
            </section>
            <section>
                <NoSchoolDaysEditor calendarId={selectedCalendarId} />
            </section>
            <section>
                <FacultySemesterEditor calendarId={selectedCalendarId} />
            </section>

        </div>
    );
}
