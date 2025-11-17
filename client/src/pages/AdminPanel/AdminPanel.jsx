import { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';

import PendingHighlights from '../../components/AdminPanel/PendingHighlights';
import PendingArticles from '../../components/AdminPanel/PendingArticles';
import FAQSection from '../../components/AdminPanel/FAQSection';
import FacultySection from '../../components/AdminPanel/FacultySection';
import StudentResourceSection from '../../components/AdminPanel/StudentResourceSection';
import HighlightsSection from '../../components/AdminPanel/HighlightsSection';
import TechBlogSection from '../../components/AdminPanel/TechBlogSection';
import PendingAccountsSection from '../../components/AdminPanel/PendingAccountsSection';
import UserControlsSection from '../../components/AdminPanel/UserControlsSection';
//import TestScriptSection from '../../components/AdminPanel/TestScript';

import { adminService } from '../../services/adminService';

export default function AdminPanel() {
    const [activeCategory, setActiveCategory] = useState('student-highlights');
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleSelect = (category) => setActiveCategory(category);

    const handleDelete = (id) => {
        // TODO: implement delete functionality
        console.log('Delete admin with id:', id);
    };

    useEffect(() => {
        const loadAdmins = async () => {
            try {
                setIsLoading(true);
                const data = await adminService.getAllAdmins();
                setAdmins(data);
            } catch (err) {
                console.error('Error loading admins:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadAdmins();
    }, []);

    if (isLoading) return <p>Loading admins...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="flex min-h-screen mx-auto">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
                </div>
                <nav className="px-4 py-6 space-y-2">
                    {/* Example Dropdown for Student Highlights */}
                    <div>
                        <button
                            onClick={() =>
                                setOpenDropdown(
                                    openDropdown === 'studenthighlights'
                                        ? null
                                        : 'studenthighlights'
                                )
                            }
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-all text-gray-700 hover:bg-gray-100"
                        >
                            <i className="fas fa-folder"></i> Student Highlights
                            <span className="ml-auto">
                                <svg
                                    className={`w-4 h-4 transition-transform ${openDropdown === 'studenthighlights' ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </span>
                        </button>
                        {openDropdown === 'studenthighlights' && (
                            <div className="ml-6 mt-1 space-y-1">
                                <button
                                    onClick={() => handleSelect('cur-student-highlights')}
                                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-all ${activeCategory === 'cur-student-highlights'
                                        ? 'bg-gray-200 text-gray-900'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    Current Student Highlights
                                </button>
                                <button
                                    onClick={() => handleSelect('student-highlights')}
                                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-all ${activeCategory === 'student-highlights'
                                        ? 'bg-gray-200 text-gray-900'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    Pending Student Highlights
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Add other sections like Tech Blog, Events, FAQ, Faculty Directory similarly */}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-x-auto">
                {activeCategory === 'student-highlights' && <PendingHighlights />}
                {activeCategory === 'cur-student-highlights' && <HighlightsSection />}
                {activeCategory === 'tech-blog' && <PendingArticles />}
                {activeCategory === 'cur-tech-blog' && <TechBlogSection />}
                {activeCategory === 'events' && (
                    <div className="space-y-4 p-3">
                        <h3 className="text-lg font-medium text-stone-800 mb-2">
                            Events Page - Coming Soon
                        </h3>
                        <UserControlsSection admins={admins} handleDelete={handleDelete} />
                    </div>
                )}
                {activeCategory === 'faq' && <FAQSection />}
                {activeCategory === 'faculty-directory' && <FacultySection />}
                {activeCategory === 'student-resources' && <StudentResourceSection />}
                {activeCategory === 'pending-accounts' && <PendingAccountsSection />}
            </main>
        </div>
    );
}
