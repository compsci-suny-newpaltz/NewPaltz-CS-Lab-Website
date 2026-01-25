import { Link } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { MdOutlineAdminPanelSettings, MdDashboard, MdEvent } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { BsPencil } from 'react-icons/bs';
import { PiFactoryLight } from 'react-icons/pi';
import { HiAcademicCap } from 'react-icons/hi';
import { FiExternalLink } from 'react-icons/fi';
import authService from '../services/authService';

/**
 * NavBar Component
 *
 * Primary navigation component with the following features:
 * - Sticky header with blur effect
 * - Responsive layout using flexbox
 * - Interactive dropdown menus for Blogs and Resources
 * - Smooth hover transitions and visual feedback
 * - Accessible navigation structure
 * - Consistent branding elements
 *
 * Navigation Structure:
 * - Home
 * - Hydra Dashboard (external)
 * - Courses
 * - Calendar
 * - Events
 * - Blogs (dropdown)
 *   └─ Student Highlights
 *   └─ Tech Blog
 * - Resources (dropdown)
 *   └─ Student Resources
 *   └─ Faculty Directory
 *   └─ FAQ
 *   └─ Student Forms
 *   └─ Course Progression
 *   └─ Comp Exam
 *
 * @component
 */

const NavBar = () => {

  const isAuthenticated = authService.isAuthenticated();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };


  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-stone-50/95 backdrop-blur-sm px-8 py-4 shadow-sm border-b border-stone-100">
      {/* Logo */}
      <Link
        to="/"
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 text-xs font-bold text-white shadow-md hover:scale-105 transition-transform duration-200"
      >
        CS lab
      </Link>

      {/* Main Navigation Menu */}
      <ul className="flex items-center gap-1 rounded-2xl bg-stone-100/80 px-4 py-2 shadow-inner border border-stone-200/50">
        {/* Home */}
        <Link to="/">
          <li className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
            <p className="flex items-center gap-1">
              <AiOutlineHome /> Home
            </p>
          </li>
        </Link>

        {/* Hydra Dashboard - External Link */}
        <a
          href="https://hydra.newpaltz.edu/dashboard"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
            <p className="flex items-center gap-1">
              <MdDashboard /> Hydra <FiExternalLink className="text-xs opacity-70" />
            </p>
          </li>
        </a>

        {/* Courses */}
        <Link to="/courses">
          <li className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
            <p className="flex items-center gap-1">
              <HiAcademicCap /> Courses
            </p>
          </li>
        </Link>

        {/* Calendar */}
        <Link to="/calendar">
          <li className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
            <p className="flex items-center gap-1">
              <IoCalendarClearOutline /> Calendar
            </p>
          </li>
        </Link>

        {/* Events */}
        <Link to="/events">
          <li className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
            <p className="flex items-center gap-1">
              <MdEvent /> Events
            </p>
          </li>
        </Link>

        {/* Blogs Dropdown */}
        <li className="group relative rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
          <span className="cursor-pointer">
            <p className="flex items-center gap-1">
              <BsPencil /> Blogs
            </p>
          </span>

          {/* Dropdown container */}
          <ul className="invisible absolute left-0 mt-2 w-56 scale-95 transform rounded-xl bg-white py-2 opacity-0 shadow-lg ring-1 ring-stone-200/50 transition-all duration-300 ease-in-out group-hover:visible group-hover:scale-100 group-hover:opacity-100">
            <li>
              <Link
                to="/student-highlights"
                className="block px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-rose-300/80 hover:text-stone-900"
              >
                Student Highlights
              </Link>
            </li>
            <li>
              <Link
                to="/tech-blog"
                className="block px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-rose-300/80 hover:text-stone-900"
              >
                Tech Blog
              </Link>
            </li>
          </ul>
        </li>

        {/* Resources Dropdown */}
        <li className="group relative rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
          <span className="cursor-pointer">
            <p className="flex items-center gap-1">
              <PiFactoryLight size={18} /> Resources
            </p>
          </span>

          {/* Dropdown container */}
          <ul className="invisible absolute left-0 mt-2 w-56 scale-95 transform rounded-xl bg-white py-2 opacity-0 shadow-lg ring-1 ring-stone-200/50 transition-all duration-300 ease-in-out group-hover:visible group-hover:scale-100 group-hover:opacity-100">
            <li>
              <Link
                to="/student-resources"
                className="block px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-rose-300/80 hover:text-stone-900"
              >
                Student Resources
              </Link>
            </li>
            <li>
              <Link
                to="/faculty"
                className="block px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-rose-300/80 hover:text-stone-900"
              >
                Faculty Directory
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="block px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-rose-300/80 hover:text-stone-900"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/student-forms"
                className="block px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-rose-300/80 hover:text-stone-900"
              >
                Student Forms
              </Link>
            </li>
            <li>
              <Link
                to="/course-progression"
                className="block px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-rose-300/80 hover:text-stone-900"
              >
                Course Progression
              </Link>
            </li>
            <li>
              <Link
                to="/comp-exam"
                className="block px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-rose-300/80 hover:text-stone-900"
              >
                Comp Exam
              </Link>
            </li>
          </ul>
        </li>

        {/* Admin Option (Visible only when authenticated) */}
        {isAuthenticated && (
          <Link to="/admin-panel">
            <li className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
              <p className="flex items-center gap-1">
                <MdOutlineAdminPanelSettings size={18} />
                Admin Panel
              </p>
            </li>
          </Link>
        )}
      </ul>

      {/* Login/Logout Button */}
      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="rounded-xl bg-gradient-to-r from-orange-300 to-amber-400 px-5 py-2 text-sm font-semibold text-stone-800 shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-105"
        >
          Logout
        </button>
      ) : (
        <Link
          to="/admin-login"
          className="rounded-xl bg-gradient-to-r from-orange-300 to-amber-400 px-5 py-2 text-sm font-semibold text-stone-800 shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-105"
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
