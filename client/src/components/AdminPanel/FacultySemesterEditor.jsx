import { useEffect, useState } from "react";
import facultyService from "../../services/facultyService";
import schoolCalendarService from "../../services/schoolCalendarService";


export default function FacultySemesterEditor({ calendarId }) {
    const [faculty, setFaculty] = useState([]);
    const [semester, setSemester] = useState("Fall");
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [assigned, setAssigned] = useState([]);

    const semesters = ["Fall", "Winter", "Spring", "Summer"];

    useEffect(() => {
        loadFaculty();
        loadAssigned();
    }, [semester]);

    async function loadFaculty() {
        const list = await facultyService.getAllFaculty();
        setFaculty(list);
    }

    async function loadAssigned() {
        const rows = await schoolCalendarService.getFacultyForSemester(calendarId, semester);
        setAssigned(rows);
    }

    async function assignFaculty() {
        if (!selectedFaculty) return;
        await schoolCalendarService.addFacultyToSemester(calendarId, selectedFaculty, semester);
        setSelectedFaculty("");
        loadAssigned();
    }

    async function remove(entryId) {
        await schoolCalendarService.deleteFacultyFromSemester(entryId);
        loadAssigned();
    }

    // Filter out faculty already assigned to this semester
    const availableFaculty = faculty.filter(f =>
        !assigned.some(a => a.FacultyId === f.id)
    );



    return (
        <div className="p-4 border rounded-xl bg-white shadow-md">
            <h2 className="text-xl font-bold mb-4">Faculty by Semester</h2>

            <div className="flex gap-4 mb-4">
                <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="border p-2 rounded"
                >
                    {semesters.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="border p-2 rounded flex-1"
                >
                    <option value="">Select Faculty</option>

                    {/* THIS NOW SHOWS ONLY UNASSIGNED FACULTY */}
                    {availableFaculty.map(f => (
                        <option key={f.id} value={f.id}>
                            {f.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={assignFaculty}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Assign
                </button>
            </div>

            <ul className="space-y-2">
                {assigned.map(a => (
                    <li key={a.EntryId} className="flex justify-between items-center border p-2 rounded">
                        <span>{a.name}</span>
                        <button
                            onClick={() => remove(a.EntryId)}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
