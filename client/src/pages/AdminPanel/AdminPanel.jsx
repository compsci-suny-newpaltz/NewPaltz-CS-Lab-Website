// src/pages/Admin/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useLocation, Navigate } from "react-router-dom";
import { FiUser, FiSettings, FiFileText, FiUsers, FiHelpCircle, FiMonitor, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { MdOutlineHighlight, MdOutlineArticle, MdEvent } from 'react-icons/md';
import { HiAcademicCap } from 'react-icons/hi';
import { PiExam } from 'react-icons/pi';

import PendingHighlights from '../../components/AdminPanel/PendingHighlights';
import HighlightsSection from '../../components/AdminPanel/HighlightsSection';
import PendingArticles from '../../components/AdminPanel/PendingArticles';
import TechBlogSection from '../../components/AdminPanel/TechBlogSection';
import FAQSection from '../../components/AdminPanel/FAQSection';
import FacultySection from '../../components/AdminPanel/FacultySection';
import StudentResourceSection from '../../components/AdminPanel/StudentResourceSection';
import EventsSection from '../../components/AdminPanel/EventsSection';
import MonitoringPanelPage from './MonitoringPanelPage';
import CoursesManagement from './Courses/CoursesManagement';
import CompExamSection from '../../components/AdminPanel/CompExamSection';
import OfficeHourPage from './Faculty/OfficeHourPage';
import SchoolCalendarPage from './Faculty/SchoolCalendarPage';

export default function AdminPanel() {
    const { user, isAdmin, loading, logout } = useAuth();
    const location = useLocation();
    const initialCategory = location.state?.activeCategory || 'student-highlights';
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleSelect = (category) => setActiveCategory(category);

    useEffect(() => {
        if (location.state?.activeCategory) {
            setActiveCategory(location.state.activeCategory);
        }
    }, [location.state]);

    // Panel configuration - simplified for SSO (all panels accessible to admins)
    const panels = [
        {
            key: 'student-highlights',
            label: 'Student Highlights',
            icon: MdOutlineHighlight,
            children: [
                { key: 'pending', label: 'Pending', component: <PendingHighlights /> },
                { key: 'current', label: 'Current', component: <HighlightsSection /> },
            ]
        },
        {
            key: 'tech-blog',
            label: 'Tech Blog',
            icon: MdOutlineArticle,
            children: [
                { key: 'tech-blog', component: <PendingArticles />, label: 'Pending' },
                { key: 'cur-tech-blog', component: <TechBlogSection />, label: 'Current' },
            ]
        },
        {
            key: 'events',
            label: 'Events',
            icon: MdEvent,
            children: [
                { key: 'current-events', label: 'Manage Events', component: <EventsSection /> },
            ]
        },
        {
            key: 'faculty',
            label: 'Faculty',
            icon: FiUsers,
            children: [
                { key: 'faculty-directory', component: <FacultySection />, label: 'Directory' },
                { key: 'faculty-office-hours', component: <OfficeHourPage />, label: 'Office Hours' },
                { key: 'faculty-school-calendar', component: <SchoolCalendarPage />, label: 'School Calendar' },
            ]
        },
        { key: 'faq', component: <FAQSection />, label: 'FAQs', icon: FiHelpCircle },
        { key: 'student-resources', component: <StudentResourceSection />, label: 'Resources', icon: FiFileText },
        { key: 'courses', component: <CoursesManagement />, label: 'Courses', icon: HiAcademicCap },
        { key: 'comp-exam', component: <CompExamSection />, label: 'Comp Exam', icon: PiExam },
        { key: 'monitoring-panel', component: <MonitoringPanelPage />, label: 'Monitoring', icon: FiMonitor },
    ];

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-rose-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-stone-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Not admin - show access denied
    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-rose-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiSettings className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-stone-800 mb-2">Access Denied</h1>
                    <p className="text-stone-600 mb-6">
                        The admin panel is only accessible to faculty members and authorized administrators.
                    </p>
                    <p className="text-sm text-stone-500">
                        Signed in as: <span className="font-medium">{user.email}</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-stone-50 to-rose-50/30">
            {/* Sidebar */}
            <aside className="w-72 bg-white/80 backdrop-blur-sm border-r border-stone-200/50 shadow-lg">
                {/* Header */}
                <div className="p-6 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center shadow-md">
                            <FiSettings className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-stone-800">Admin Panel</h1>
                            <p className="text-xs text-stone-500">CS Lab Management</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 mx-4 mt-4 rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-300 to-orange-300 flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-800 truncate">{user.name}</p>
                            <p className="text-xs text-stone-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-rose-100 text-rose-700 capitalize">
                            {user.affiliation || 'Admin'}
                        </span>
                        <button
                            onClick={logout}
                            className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                        >
                            <FiLogOut className="w-3 h-3" /> Sign out
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="px-4 py-6 space-y-1">
                    {panels.map(panel => {
                        const Icon = panel.icon;
                        const isActive = panel.children
                            ? panel.children.some(c => c.key === activeCategory)
                            : panel.key === activeCategory;

                        return (
                            <div key={panel.key}>
                                {panel.children ? (
                                    <>
                                        <button
                                            onClick={() => setOpenDropdown(openDropdown === panel.key ? null : panel.key)}
                                            className={`
                                                flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl w-full text-left
                                                transition-all duration-200
                                                ${isActive
                                                    ? 'bg-gradient-to-r from-rose-100 to-orange-100 text-rose-700'
                                                    : 'text-stone-600 hover:bg-stone-100'
                                                }
                                            `}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {panel.label}
                                            <FiChevronDown
                                                className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                                                    openDropdown === panel.key ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>

                                        <div className={`
                                            overflow-hidden transition-all duration-200
                                            ${openDropdown === panel.key ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
                                        `}>
                                            <div className="mt-1 ml-4 pl-4 border-l-2 border-stone-200 space-y-1">
                                                {panel.children.map(sub => (
                                                    <button
                                                        key={sub.key}
                                                        onClick={() => handleSelect(sub.key)}
                                                        className={`
                                                            block w-full text-left px-3 py-2 text-sm rounded-lg
                                                            transition-all duration-200
                                                            ${activeCategory === sub.key
                                                                ? 'bg-rose-100 text-rose-700 font-medium'
                                                                : 'text-stone-600 hover:bg-stone-100'
                                                            }
                                                        `}
                                                    >
                                                        {sub.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleSelect(panel.key)}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl w-full text-left
                                            transition-all duration-200
                                            ${activeCategory === panel.key
                                                ? 'bg-gradient-to-r from-rose-100 to-orange-100 text-rose-700'
                                                : 'text-stone-600 hover:bg-stone-100'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {panel.label}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-x-auto">
                <div className="max-w-7xl mx-auto">
                    {panels.map(panel => {
                        if (panel.children) {
                            const child = panel.children.find(c => c.key === activeCategory);
                            if (child) {
                                return (
                                    <div key={child.key} className="animate-fadeIn">
                                        {child.component}
                                    </div>
                                );
                            }
                        }

                        if (panel.key === activeCategory) {
                            return (
                                <div key={panel.key} className="animate-fadeIn">
                                    {panel.component}
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>
            </main>

            {/* Add fadeIn animation */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
