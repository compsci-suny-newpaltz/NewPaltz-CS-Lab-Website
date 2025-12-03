import facultyService from "../../services/facultyService";
import { useState, useEffect } from "react";

export default function FacultyOfficeHoursEditor({ id, office_hours }) {
    const [officeHours, setOfficeHours] = useState(office_hours || "");
    const [statusMessage, setStatusMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        setOfficeHours(office_hours || "");
    }, [office_hours]);

    const handleSave = async () => {
        setIsSaving(true);
        setErrorMessage("");
        try {
            const result = await facultyService.updateFacultyOfficeHours(id, officeHours);
            setStatusMessage("Office hours updated successfully.");
        } catch (error) {
            setErrorMessage("Failed to update office hours. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 border rounded shadow-sm bg-white">
            <h3 className="text-lg font-semibold mb-2">Edit Office Hours</h3>
            <textarea
                className="w-full p-2 border rounded mb-3"
                rows="4"
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
                disabled={isSaving}
            />
            <div className="flex items-center space-x-4">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleSave}
                    disabled={isSaving}
                >Save</button>
                {isSaving && <span className="text-gray-600">Saving...</span>}
                {statusMessage && <span className="text-green-600">{statusMessage}</span>}
                {errorMessage && <span className="text-red-600">{errorMessage}</span>}
            </div>
        </div>
    );
}
