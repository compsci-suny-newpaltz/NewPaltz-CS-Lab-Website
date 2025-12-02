import { RiGalleryView2 } from 'react-icons/ri';
import { LuCalendarDays } from 'react-icons/lu';
import { IoIosBook } from 'react-icons/io';
import { LuNotepadText } from 'react-icons/lu';
import { FaQuestion, FaGraduationCap, FaWpforms } from 'react-icons/fa6';
import { GiPartyPopper } from 'react-icons/gi';
import { FaComputer } from 'react-icons/fa6';
import { HiAcademicCap } from 'react-icons/hi';
import { TbListTree } from 'react-icons/tb';
import { Link } from 'react-router-dom';

/**
 * BentoBox Component
 *
 * A modern grid-based navigation interface that displays different sections of the website
 * in an aesthetically pleasing and interactive layout.
 *
 * Features:
 * - Responsive grid layout (4x6)
 * - Interactive hover animations
 * - Consistent visual styling
 * - Gradient backgrounds
 * - Icon animations
 *
 * Grid Layout:
 * - Student Highlights (1x3) - Tall format
 * - Event Calendar (3x2) - Wide format
 * - Faculty Directory (1x1) - Standard
 * - Student Resources (1x1) - Standard
 * - FAQ (1x1) - Standard
 * - Featured Event (3x2) - Wide format
 * - Tech Blog (1x2) - Medium height
 */

const BentoBox = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center py-8">
            {/* Main Grid Container
       * - 4 columns x 7 rows
       * - Responsive width (2/3 of container)
       * - Consistent gap spacing
       */}
            <div
                id="bento-box-section"
                className="grid h-full w-2/3 grid-cols-4 grid-rows-8 gap-4"
            >
                {/* Student Highlights - Tall Format */}
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

                {/* Event Calendar - Wide Format */}
                <Link to="/calendar" className="group relative col-span-3 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-green-200 to-green-300 p-6 transition-all duration-500 hover:scale-[1.04] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <LuCalendarDays
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-lg font-medium text-white">Event Calendar</span>
                </Link>

                {/* Faculty Directory */}
                <Link to="/faculty" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-200 to-sky-300 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <IoIosBook
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium text-white">
                        Faculty Directory
                    </span>
                </Link>

                {/* Student Resources */}
                <Link to="/student-resources" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-red-300 to-red-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <LuNotepadText
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium text-white">
                        Student Resources
                    </span>
                </Link>

                {/* FAQ */}
                <Link to="/faq" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-300 to-orange-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <FaQuestion
                        size={50}
                        className="text-white transition-transform group-hover:scale-110 group-hover:rotate-12"
                    />
                    <span className="text-sm font-medium text-white">FAQ</span>
                </Link>

                {/* Events - Wide Format */}
                <Link to="/events" className="group relative col-span-2 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-200 to-amber-300 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <GiPartyPopper
                        size={50}
                        className="text-white transition-transform group-hover:scale-110 group-hover:rotate-12"
                    />
                    <span className="text-lg font-medium text-white">Events</span>
                </Link>

                {/* Tech Blog - Medium Format */}
                <Link to="/tech-blog" className="group relative col-span-1 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-300 to-purple-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <FaComputer
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-lg font-medium text-white">Tech Blog</span>
                </Link>

                {/* Courses - Wide Format */}
                <Link to="/courses" className="group relative col-span-2 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-300 to-indigo-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <HiAcademicCap
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-lg font-medium text-white">Courses & Syllabi</span>
                </Link>

                {/* Comp Exam */}
                <Link to="/comp-exam" className="group relative col-span-1 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-300 to-teal-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <FaGraduationCap
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium text-white">Comp Exam</span>
                </Link>

                {/* Student Forms */}
                <Link to="/student-forms" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-pink-300 to-pink-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <FaWpforms
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium text-white">Student Forms</span>
                </Link>

                {/* Course Progression */}
                <Link to="/course-progression" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-lime-300 to-lime-400 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <TbListTree
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium text-white">Course Progression</span>
                </Link>
            </div>
        </div>
    );
};

/**
 * Styling Notes:
 * - Uses Tailwind CSS for responsive design
 * - Implements group hover effects for coordinated animations
 * - Consistent transition durations (300ms)
 * - Calculated scale factors for subtle hover effects
 */

export default BentoBox;
