import { Link } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import { TbWriting } from 'react-icons/tb';
import { FaGithub, FaRocket, FaTrophy } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings, MdDashboard } from "react-icons/md";
import { HiAcademicCap, HiViewGrid } from 'react-icons/hi';
import { FiExternalLink, FiUser, FiLogOut, FiLogIn, FiUsers, FiHelpCircle, FiFileText, FiTrendingUp, FiStar, FiEdit3 } from 'react-icons/fi';
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
 * - GitHub (external)
 * - Comp Exam (external)
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

        {/* GitHub */}
        <a
          href="https://github.com/compsci-suny-newpaltz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
            <p className="flex items-center gap-1">
              <FaGithub /> GitHub <FiExternalLink className="text-xs opacity-70" />
            </p>
          </li>
        </a>

        {/* Comp Exam */}
        <a
          href="https://hydra.newpaltz.edu/comp-exam"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
            <p className="flex items-center gap-1">
              <TbWriting /> Comp Exam <FiExternalLink className="text-xs opacity-70" />
            </p>
          </li>
        </a>
        {/* Hackathon */}
        <a
          href="https://hydra.newpaltz.edu/hackathons"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
            <p className="flex items-center gap-1">
              <FaTrophy /> Hackathon <FiExternalLink className="text-xs opacity-70" />
            </p>
          </li>
        </a>

        {/* Student Resources */}
        <Link to="/student-resources">
          <li className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
            <p className="flex items-center gap-1">
              <FaRocket /> Resources
            </p>
          </li>
        </Link>

        {/* More Menu - Grid Dropdown */}
        <li className="group relative rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-rose-300/80 hover:text-stone-900">
          <span className="cursor-pointer">
            <p className="flex items-center gap-1">
              <HiViewGrid size={18} /> More
            </p>
          </span>

          {/* Grid Dropdown */}
          <div className="invisible absolute right-0 mt-2 w-72 scale-95 transform rounded-2xl bg-gradient-to-br from-white to-stone-50 p-3 opacity-0 shadow-2xl ring-1 ring-stone-200/50 transition-all duration-300 ease-in-out group-hover:visible group-hover:scale-100 group-hover:opacity-100">
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/faculty"
                className="flex flex-col items-center gap-1 rounded-xl p-3 text-stone-600 transition-all hover:bg-gradient-to-br hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:shadow-md"
              >
                <FiUsers size={20} />
                <span className="text-xs font-medium">Faculty</span>
              </Link>
              <Link
                to="/faq"
                className="flex flex-col items-center gap-1 rounded-xl p-3 text-stone-600 transition-all hover:bg-gradient-to-br hover:from-amber-500 hover:to-orange-600 hover:text-white hover:shadow-md"
              >
                <FiHelpCircle size={20} />
                <span className="text-xs font-medium">FAQ</span>
              </Link>
              <Link
                to="/student-forms"
                className="flex flex-col items-center gap-1 rounded-xl p-3 text-stone-600 transition-all hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-600 hover:text-white hover:shadow-md"
              >
                <FiFileText size={20} />
                <span className="text-xs font-medium">Forms</span>
              </Link>
              <Link
                to="/course-progression"
                className="flex flex-col items-center gap-1 rounded-xl p-3 text-stone-600 transition-all hover:bg-gradient-to-br hover:from-violet-500 hover:to-purple-600 hover:text-white hover:shadow-md"
              >
                <FiTrendingUp size={20} />
                <span className="text-xs font-medium">Progression</span>
              </Link>
              <Link
                to="/student-highlights"
                className="flex flex-col items-center gap-1 rounded-xl p-3 text-stone-600 transition-all hover:bg-gradient-to-br hover:from-pink-500 hover:to-rose-600 hover:text-white hover:shadow-md"
              >
                <FiStar size={20} />
                <span className="text-xs font-medium">Highlights</span>
              </Link>
              <Link
                to="/tech-blog"
                className="flex flex-col items-center gap-1 rounded-xl p-3 text-stone-600 transition-all hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 hover:text-white hover:shadow-md"
              >
                <FiEdit3 size={20} />
                <span className="text-xs font-medium">Tech Blog</span>
              </Link>
            </div>
          </div>
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
