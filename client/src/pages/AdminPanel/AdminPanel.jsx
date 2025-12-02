// src/pages/Admin/AdminPanel.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

import PendingHighlights from '../../components/AdminPanel/PendingHighlights';
import HighlightsSection from '../../components/AdminPanel/HighlightsSection';
import PendingArticles from '../../components/AdminPanel/PendingArticles';
import TechBlogSection from '../../components/AdminPanel/TechBlogSection';
import FAQSection from '../../components/AdminPanel/FAQSection';
import FacultySection from '../../components/AdminPanel/FacultySection';
import StudentResourceSection from '../../components/AdminPanel/StudentResourceSection';
import PendingAccountsSection from '../../components/AdminPanel/PendingAccountsSection';
import UserControlsSection from '../../components/AdminPanel/UserControlsSection';

import PendingEvents from '../../components/AdminPanel/PendingEvents';
import EventsSection from '../../components/AdminPanel/EventsSection';

import MonitoringPanelPage from './MonitoringPanelPage';

import CoursesManagement from './Courses/CoursesManagement';
import CompExamSection from '../../components/AdminPanel/CompExamSection';

import { adminService } from '../../services/adminService';

const HYDRA_BASE_URL = import.meta.env.VITE_HYDRA_BASE_URL || 'https://hydra.newpaltz.edu';

export default function AdminPanel() {
    const { user, samlUser, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('student-highlights');
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleSelect = (category) => setActiveCategory(category);
    const handleDelete = (id) => console.log('Delete admin with id:', id);

    // Check if user can access based on roles - SAML admins get full admin access
    const canAccess = (roles) => {
        if (samlUser?.isAdmin) return true; // SAML admins can access everything
        return user?.role && roles.includes(user.role);
    };

    const handleLogout = () => {
        logout();
        navigate('/admin-login');
    };

    // Load admins
    useEffect(() => {
        const loadAdmins = async () => {
            try {
                setIsLoading(true);
                const data = await adminService.getAllAdmins();
                setAdmins(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadAdmins();
    }, []);

    // Panel configuration
    const panels = [
        {
            key: 'student-highlights', label: 'Student Highlights', roles: ['admin', 'editor'], children: [
                { key: 'pending', label: 'Pending Student Highlights', component: <PendingHighlights /> },
                { key: 'current', label: 'Current Student Highlights', component: <HighlightsSection /> },
            ]
        },
        {
            key: 'tech-blog', label: 'Technology Blog', roles: ['admin', 'editor'], children: [
                { key: 'tech-blog', component: <PendingArticles />, label: 'Pending Technology Blog' },
                { key: 'cur-tech-blog', component: <TechBlogSection />, label: 'Current Tech Blog' },
            ]
        },
        {
            key: 'events', label: 'Events', roles: ['admin', 'editor', 'club'], children: [
                { key: 'pending-events', label: 'Pending Events', component: <PendingEvents /> },
                { key: 'current-events', label: 'Current Events', component: <EventsSection /> },
            ]
        },
        { key: 'faq', component: <FAQSection />, roles: ['admin'], label: 'FAQs' },
        { key: 'faculty-directory', component: <FacultySection />, roles: ['admin', 'editor'], label: 'Faculty Directory' },
        { key: 'student-resources', component: <StudentResourceSection />, roles: ['admin', 'editor'], label: 'Student Resources' },
        { key: 'courses', component: <CoursesManagement />, roles: ['admin', 'editor'], label: 'Courses' },
        { key: 'comp-exam', component: <CompExamSection />, roles: ['admin'], label: 'Comp Exam Settings' },
        { key: 'pending-accounts', component: <PendingAccountsSection />, roles: ['admin'], label: 'Pending Accounts' },
        { key: 'user-controls', component: <UserControlsSection admins={admins} handleDelete={handleDelete} />, roles: ['admin'], label: 'User Controls' },

        { key: 'monitoring-panel', component: <MonitoringPanelPage />, roles: ['admin'], label: 'Monitoring Panel' },

    ];

    if (loading) return <p>Loading user...</p>;
    if (!user && !samlUser?.isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50">
                <p className="text-lg text-gray-700 mb-4">You are not authorized to view this page.</p>
                <button
                    onClick={() => window.location.href = `${HYDRA_BASE_URL}/login?returnTo=${encodeURIComponent(window.location.href)}`}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Sign in with New Paltz SSO
                </button>
            </div>
        );
    }
    if (isLoading) return <p>Loading admins...</p>;
    if (error) return <p>Error:{error}</p>;

    // Get display name for current user
    const displayName = samlUser?.name || user?.username || 'Admin';
    const displayEmail = samlUser?.email || user?.email || '';
    const isSamlAdmin = samlUser?.isAdmin;

    function ComingSoon() {
        return (
            <div className="p-4 text-gray-700 bg-gray-50 rounded-md border border-gray-200">
                Events is coming soon!
            </div>
        );
    }
    return (
        <div className="flex min-h-screen mx-auto">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
                    <div className="mt-2 text-sm">
                        <p className="font-medium text-gray-700 truncate">{displayName}</p>
                        {displayEmail && <p className="text-gray-500 text-xs truncate">{displayEmail}</p>}
                        {isSamlAdmin && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                SSO Admin
                            </span>
                        )}
                    </div>
                </div>
                <nav className="px-4 py-6 space-y-2">
                    {panels
                        .filter(panel => canAccess(panel.roles))
                        .map(panel => {
                            // Determine if dropdown needed
                            const isDropdown = ['student-highlights', 'tech-blog', 'events'].includes(panel.key);
                            return (
                                <div key={panel.key}>
                                    {panel.children ? (
                                        <>
                                            {/* Parent button */}
                                            <button
                                                onClick={() =>
                                                    setOpenDropdown(openDropdown === panel.key ? null : panel.key)
                                                }
                                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-all text-gray-700 hover:bg-gray-100"
                                            >
                                                {panel.label}
                                                <span className="ml-auto">
                                                    <svg
                                                        className={`w-4 h-4 transition-transform ${openDropdown === panel.key ? 'rotate-180' : ''
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

                                            {/* Child dropdown items */}
                                            {openDropdown === panel.key && (
                                                <div className="mt-1 space-y-1 ">
                                                    {panel.children.map(sub => (
                                                        <button
                                                            key={sub.key}
                                                            onClick={() => handleSelect(sub.key)}
                                                            className={`block w-full text-left pl-10 pr-3 py-2 text-sm font-medium rounded-md transition-all ${activeCategory === sub.key
                                                                ? 'bg-gray-200 text-gray-900'
                                                                : 'text-gray-700 hover:bg-gray-100'
                                                                }`}
                                                        >
                                                            {sub.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleSelect(panel.key)}
                                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-all ${activeCategory === panel.key
                                                ? 'bg-gray-200 text-gray-900'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {panel.label}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                </nav>

                {/* Logout button at bottom */}
                <div className="mt-auto p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-x-auto">
                {/* Check top-level panels */}
                {panels.map(panel => {
                    // child?
                    if (panel.children) {
                        const child = panel.children.find(c => c.key === activeCategory);
                        if (child) {
                            return <div key={child.key}>{child.component}</div>;
                        }
                    }

                    // regular (non-child) panel
                    if (panel.key === activeCategory) {
                        return <div key={panel.key}>{panel.component}</div>;
                    }

                    return null;
                })}
            </main>

        </div>
    );

}
