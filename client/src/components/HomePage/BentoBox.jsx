import { RiGalleryView2 } from 'react-icons/ri';
import { LuCalendarDays } from 'react-icons/lu';
import { IoIosBook } from 'react-icons/io';
import { LuNotepadText } from 'react-icons/lu';
import { FaQuestion } from 'react-icons/fa6';
import { GiPartyPopper } from 'react-icons/gi';
import { FaComputer } from 'react-icons/fa6';
import { HiAcademicCap } from 'react-icons/hi';
import { MdDashboard, MdEvent } from 'react-icons/md';
import { FiExternalLink } from 'react-icons/fi';
import { BsFileEarmarkText, BsArrowRight } from 'react-icons/bs';
import { PiExam } from 'react-icons/pi';
import { Link } from 'react-router-dom';

/**
 * BentoBox Component
 *
 * A modern grid-based navigation interface that displays different sections of the website
 * in an aesthetically pleasing and interactive layout.
 *
 * Features:
 * - Responsive grid layout (5x8)
 * - Interactive hover animations
 * - Consistent visual styling
 * - Gradient backgrounds
 * - Icon animations
 *
 * Grid Layout - All Services:
 * - Hydra Dashboard (2x2) - External link
 * - Student Highlights (1x3) - Tall format
 * - Event Calendar (2x2) - Wide format
 * - Courses (1x2) - Medium
 * - Faculty Directory (1x1) - Standard
 * - Student Resources (1x1) - Standard
 * - FAQ (1x1) - Standard
 * - Events (2x2) - Wide format
 * - Tech Blog (1x2) - Medium height
 * - Course Progression (1x2) - Medium
 * - Student Forms (1x1) - Standard
 * - Comp Exam (1x1) - Standard
 */

const BentoBox = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center py-12">
            {/* Main Grid Container
       * - 5 columns x 8 rows
       * - Responsive width (3/4 of container)
       * - Consistent gap spacing
       */}
            <div
                id="bento-box-section"
                className="grid w-3/4 grid-cols-5 auto-rows-[100px] gap-4"
            >
                {/* Grid Items - All Services
         * Common Features:
         * - Gradient backgrounds
         * - Scale animation on hover
         * - Icon + text layout
         * - Consistent padding
         * - Shadow enhancement on hover
         */}

                {/* Hydra Dashboard - Featured External Link
         * Spans 2 columns x 2 rows
         * Primary lab resource access
         */}
                <a
                    href="/dashboard"
                    className="group relative col-span-2 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-400 to-indigo-600 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg"
                >
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <MdDashboard
                        size={60}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-lg font-medium text-white flex items-center gap-2">
                        Hydra Dashboard <FiExternalLink className="text-sm opacity-70" />
                    </span>
                    <span className="text-xs text-white/70">Lab Computing Environment</span>
                </a>

                {/* Student Highlights - Tall Format
         * Spans 1 column x 3 rows
         */}
                <Link to="/student-highlights" className="group relative col-span-1 row-span-3 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-rose-300 to-rose-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <RiGalleryView2
                        size={50}
                        className="text-white transition-transform group-hover:scale-110 group-hover:rotate-12"
                    />
                    <span className="text-sm font-medium text-white">
                        Student Highlights
                    </span>
                </Link>

                {/* Event Calendar - Wide Format
         * Spans 2 columns x 2 rows
         */}
                <Link to="/calendar" className="group relative col-span-2 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-green-300 to-green-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <LuCalendarDays
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-lg font-medium text-white">Event Calendar</span>
                </Link>

                {/* Courses - Medium Format
         * Spans 1 column x 2 rows
         */}
                <Link to="/courses" className="group relative col-span-1 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-300 to-teal-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <HiAcademicCap
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium text-white">Courses</span>
                </Link>

                {/* Faculty Directory - Standard Format
         */}
                <Link to="/faculty" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-300 to-sky-400 p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <IoIosBook
                        size={40}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-xs font-medium text-white">
                        Faculty Directory
                    </span>
                </Link>

                {/* Student Resources - Standard Format
         */}
                <Link to="/student-resources" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-br from-red-300 to-red-400 p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <LuNotepadText
                        size={40}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-xs font-medium text-white">
                        Student Resources
                    </span>
                </Link>

                {/* FAQ - Standard Format
         */}
                <Link to="/faq" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-300 to-orange-400 p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <FaQuestion
                        size={40}
                        className="text-white transition-transform group-hover:scale-110 group-hover:rotate-12"
                    />
                    <span className="text-xs font-medium text-white">FAQ</span>
                </Link>

                {/* Events - Wide Format
         * Spans 2 columns x 2 rows
         */}
                <Link to="/events" className="group relative col-span-2 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-300 to-amber-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <MdEvent
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-lg font-medium text-white">Events</span>
                </Link>

                {/* Tech Blog - Medium Format
         * Spans 1 column x 2 rows
         */}
                <Link to="/tech-blog" className="group relative col-span-1 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-300 to-purple-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <FaComputer
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium text-white">Tech Blog</span>
                </Link>

                {/* Course Progression - Medium Format
         * Spans 1 column x 2 rows
         */}
                <Link to="/course-progression" className="group relative col-span-1 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-300 to-cyan-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <BsArrowRight
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-xs font-medium text-white text-center">Course Progression</span>
                </Link>

                {/* Student Forms - Standard Format
         */}
                <Link to="/student-forms" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-br from-lime-300 to-lime-400 p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <BsFileEarmarkText
                        size={40}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-xs font-medium text-white">Student Forms</span>
                </Link>

                {/* Comp Exam - Standard Format
         */}
                <Link to="/comp-exam" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-br from-pink-300 to-pink-400 p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <PiExam
                        size={40}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-xs font-medium text-white">Comp Exam</span>
                </Link>
            </div>
        </div>
    );
};

/**
 * Styling Notes:
 * - Uses Tailwind CSS for responsive design
 * - Implements group hover effects for coordinated animations
 * - Consistent transition durations (500ms)
 * - Calculated scale factors for subtle hover effects
 *
 * Services Included:
 * - Hydra Dashboard (Lab Computing Environment)
 * - Student Highlights
 * - Event Calendar
 * - Courses
 * - Faculty Directory
 * - Student Resources
 * - FAQ
 * - Events
 * - Tech Blog
 * - Course Progression
 * - Student Forms
 * - Comp Exam
 */

export default BentoBox;
