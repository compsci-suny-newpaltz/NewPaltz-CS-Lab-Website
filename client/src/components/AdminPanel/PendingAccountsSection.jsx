import React, { useState, useEffect } from "react";
import sdFormService from "../../services/sdFormService";


export default function PendingAccounts() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadStudents = async () => {
            try {
                setIsLoading(true);
                const students = await sdFormService.getAllForms();
                setStudents(students);
            } catch (err) {
                console.error("Error loading students:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadStudents();
    }, []);


    if (isLoading) return <p className="p-4">Loading forms...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;

    return (
        < div className="flex-col justify-between items-center mb-6" >
            <h1 className="text-2xl font-semibold text-stone-700 mb-4">Pending Accounts</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-stone-300">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Username</th>
                            <th className="px-4 py-2 border-b">Email</th>
                            <th className="px-4 py-2 border-b">N Number</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((students) => (
                            <tr key={students.id} className="text-center">
                                <td className="px-4 py-2 border-b">{students.full_name}</td>
                                <td className="px-4 py-2 border-b">{students.email}</td>
                                <td className="px-4 py-2 border-b">{students.student_id}</td>
                                <td className="px-4 py-2 border-b">
                                    {/* <Link to={`/services/studentAccountService/${student.id}`}
                                        className="bg-green-300 rounded px-3 py-1 hover:bg-green-400 mr-2 transition-all ease-in duration-300">Approve</Link> */}
                                    <button
                                        onClick={async () => {
                                            try {
                                                // 1. Mark form as approved in your database
                                                await sdFormService.approveForm(students.id);

                                                // 2. Call Hydra through your backend proxy
                                                const resp = await fetch("/scripts/admin/createUser", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        action: "createUser",
                                                        id: students.id   // ✔ THIS IS REQUIRED since Hydra pulls email+NID from DB
                                                        //email: students.email,
                                                        //nId: students.student_id
                                                    })
                                                });

                                                const data = await resp.json();
                                                console.log("Hydra response:", data);

                                                // Optional: show script output
                                                if (data.stdout) {
                                                    alert("Hydra Script Output:\n\n" + data.stdout);
                                                }
                                                // 3. Remove the student from table UI
                                                //setStudents(prev => prev.filter(s => s.id !== students.id));
                                                //const data = await response.json()
                                                //console.log("Hydra stdout:", data.stdout);   // <---- SHOW IT

                                                //alert("Hydra output:\n\n" + data.stdout);    // <---- OPTIONAL POPUP

                                                alert("Student approved and Hydra account created!");
                                            } catch (err) {
                                                console.error(err);
                                                alert("Failed to approve student.");
                                            }
                                        }}
                                        className="bg-green-300 rounded px-3 py-1 hover:bg-green-400 mr-2 transition-all ease-in duration-300"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={async () => {
                                            if (window.confirm("Are you sure you want to deny and notify this student?")) {
                                                try {
                                                    await sdFormService.deleteForm(students.id); // API call
                                                    setStudents(prev => prev.filter(s => s.id !== students.id)); // Remove from UI
                                                    alert("Student denied and notified.");
                                                } catch (err) {
                                                    alert("Failed to deny student.");
                                                    console.error(err);
                                                }
                                            }
                                        }}
                                        className="bg-rose-300 rounded px-3 py-1 hover:bg-rose-400 transition-all ease-in duration-300">
                                        Deny
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ div>
    );
}
