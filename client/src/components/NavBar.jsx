import { Link } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { MdOutlineAdminPanelSettings, MdDashboard, MdEvent } from "react-icons/md";
import { BsPencil } from 'react-icons/bs';
import { PiFactoryLight } from 'react-icons/pi';
import { HiAcademicCap } from 'react-icons/hi';
import { FiExternalLink, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/authContext';

/**
 * NavBar Component
 *
 * Primary navigation component with the following features:
 * - Sticky header with blur effect
 * - Responsive layout using flexbox
 * - Interactive dropdown menus for Blogs and Resources
 * - Smooth hover transitions and visual feedback
 * - SSO authentication integration
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
 *   - Student Highlights
 *   - Tech Blog
 * - Resources (dropdown)
 *   - Student Resources
 *   - Faculty Directory
 *   - FAQ
 *   - Student Forms
 *   - Course Progression
 *   - Comp Exam
 *
 * @component
 */

const NavBar = () => {
  const { user, isAuthenticated, isAdmin, login, logout, loading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-stone-50/95 backdrop-blur-sm px-8 py-4 shadow-sm border-b border-stone-100">
      {/* Logo */}
      <Link
        to="/"
        className="flex h-12 w-12 items-center justify-center hover:scale-105 transition-transform duration-200"
      >
        <img
          src="/favicon.png"
          alt="CS Lab"
          className="h-12 w-12 object-contain"
        />
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

        {/* Admin Option (Visible only when user is admin) */}
        {isAdmin && (
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

      {/* User Menu / Login Button */}
      {loading ? (
        <div className="w-24 h-10 rounded-xl bg-stone-200 animate-pulse" />
      ) : isAuthenticated ? (
        <div className="group relative">
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-100 to-orange-100 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-all duration-200 hover:shadow-md hover:from-rose-200 hover:to-orange-200">
            <FiUser className="text-rose-500" />
            <span className="max-w-[120px] truncate">{user?.given_name || user?.name?.split(' ')[0] || 'User'}</span>
          </button>

          {/* User dropdown */}
          <div className="invisible absolute right-0 mt-2 w-64 scale-95 transform rounded-xl bg-white py-2 opacity-0 shadow-lg ring-1 ring-stone-200/50 transition-all duration-300 ease-in-out group-hover:visible group-hover:scale-100 group-hover:opacity-100">
            <div className="px-4 py-3 border-b border-stone-100">
              <p className="text-sm font-medium text-stone-900">{user?.name}</p>
              <p className="text-xs text-stone-500">{user?.email}</p>
              {user?.affiliation && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-rose-100 text-rose-700 capitalize">
                  {user.affiliation}
                </span>
              )}
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-rose-100 hover:text-rose-700"
            >
              <FiLogOut /> Sign out
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => login()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-300 to-amber-400 px-5 py-2 text-sm font-semibold text-stone-800 shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-105"
        >
          <FiLogIn /> Sign in
        </button>
      )}
    </nav>
  );
};

export default NavBar;
