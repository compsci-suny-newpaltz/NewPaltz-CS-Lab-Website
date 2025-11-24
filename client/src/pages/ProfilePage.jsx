import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { profileService } from '../services/profileService';

export default function ProfilePage() {
    const { id } = useParams(); // user_id from URL
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        bio: "",
    });

    // Fetch profile when the page loads
    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await profileService.getProfile(id);
                setProfile(data);

                // preload form
                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    role: data.role || "",
                    bio: data.bio || "",
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile:", error);
                setLoading(false);
            }
        }

        fetchProfile();
    }, [id]);

    // Handle editing input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Send update to backend
    const handleSave = async () => {
        try {
            const updated = await profileService.updateProfile(id, formData);
            setProfile(updated);
            setEditing(false);
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    if (!profile)
        return <p className="text-center mt-10 text-red-600">Profile not found.</p>;

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-4xl font-bold mb-6 text-stone-800">
                {profile.name}'s Profile
            </h1>

            {/* DISPLAY MODE */}
            {!editing && (
                <div className="bg-white rounded-xl shadow p-6 space-y-4">
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <p><strong>Bio:</strong> {profile.bio}</p>

                    <button
                        className="px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800"
                        onClick={() => setEditing(true)}
                    >
                        Edit Profile
                    </button>
                </div>
            )}

            {/* EDITING MODE */}
            {editing && (
                <div className="bg-white rounded-xl shadow p-6 space-y-4">
                    <div>
                        <label className="font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full border rounded-md p-2 mt-1"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="font-medium">Email</label>
                        <input
                            type="text"
                            name="email"
                            className="w-full border rounded-md p-2 mt-1"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="font-medium">Role</label>
                        <input
                            type="text"
                            name="role"
                            className="w-full border rounded-md p-2 mt-1"
                            value={formData.role}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="font-medium">Bio</label>
                        <textarea
                            name="bio"
                            className="w-full border rounded-md p-2 mt-1"
                            rows="4"
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>

                        <button
                            className="px-4 py-2 bg-stone-400 text-white rounded-lg hover:bg-stone-500"
                            onClick={() => setEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}