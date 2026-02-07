import { RiGalleryView2 } from 'react-icons/ri';
import { LuCalendarDays } from 'react-icons/lu';
import { IoIosBook } from 'react-icons/io';
import { LuNotepadText } from 'react-icons/lu';
import { FaQuestion } from 'react-icons/fa6';
import { FaComputer } from 'react-icons/fa6';
import { HiAcademicCap } from 'react-icons/hi';
import { MdDashboard, MdEvent } from 'react-icons/md';
import { FiExternalLink } from 'react-icons/fi';
import { BsFileEarmarkText, BsArrowRight } from 'react-icons/bs';
import { PiExam } from 'react-icons/pi';
import { Link } from 'react-router-dom';

/**
 * BentoBox Component - SUNY New Paltz Brand Colors
 * Primary: Blue (#003e7e) and Orange (#f58426)
 */

const BentoBox = () => {
    return (
        <div className="flex w-full items-center justify-center py-8 px-4">
            <div
                id="bento-box-section"
                className="grid w-full max-w-6xl grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 auto-rows-[90px] sm:auto-rows-[100px] gap-3 sm:gap-4"
            >
                {/* Hydra Dashboard - Primary Blue */}
                <a
                    href="/dashboard"
                    className="group relative col-span-2 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-np-blue p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
                >
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <MdDashboard
                        size={50}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-base font-semibold text-white flex items-center gap-2">
                        Hydra Dashboard <FiExternalLink className="text-xs opacity-70" />
                    </span>
                    <span className="text-xs text-white/70">Lab Computing</span>
                </a>

                {/* Student Highlights - Orange */}
                <Link to="/student-highlights" className="group relative col-span-1 row-span-3 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-np-orange p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <RiGalleryView2
                        size={40}
                        className="text-white transition-transform group-hover:scale-110 group-hover:rotate-12"
                    />
                    <span className="text-sm font-medium text-white text-center">
                        Student Highlights
                    </span>
                </Link>

                {/* Event Calendar - Cyan */}
                <Link to="/calendar" className="group relative col-span-2 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-np-cyan p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <LuCalendarDays
                        size={40}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-base font-medium text-white">Event Calendar</span>
                </Link>

                {/* Courses - Gold */}
                <Link to="/courses" className="group relative col-span-1 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-np-gold p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <HiAcademicCap
                        size={40}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium text-white">Courses</span>
                </Link>

                {/* Faculty Directory - Blue Light */}
                <Link to="/faculty" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-np-blue-400 p-3 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <IoIosBook
                        size={30}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-xs font-medium text-white">Faculty</span>
                </Link>

                {/* Student Resources - Coral */}
                <Link to="/student-resources" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-np-coral p-3 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <LuNotepadText
                        size={30}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-xs font-medium text-white">Resources</span>
                </Link>

                {/* FAQ - Orange Light */}
                <Link to="/faq" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-np-orange-400 p-3 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <FaQuestion
                        size={28}
                        className="text-white transition-transform group-hover:scale-110 group-hover:rotate-12"
                    />
                    <span className="text-xs font-medium text-white">FAQ</span>
                </Link>

                {/* Events - Blue */}
                <Link to="/events" className="group relative col-span-2 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-np-blue to-np-blue-600 p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <MdEvent
                        size={40}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-base font-medium text-white">Events</span>
                </Link>

                {/* Tech Blog - Steel */}
                <Link to="/tech-blog" className="group relative col-span-1 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-np-steel p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <FaComputer
                        size={36}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium text-white">Tech Blog</span>
                </Link>

                {/* Course Progression - Lime */}
                <Link to="/course-progression" className="group relative col-span-1 row-span-2 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-np-lime p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <BsArrowRight
                        size={36}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-xs font-medium text-white text-center">Course Path</span>
                </Link>

                {/* Student Forms - Rust */}
                <Link to="/student-forms" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-np-rust p-3 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <BsFileEarmarkText
                        size={28}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-xs font-medium text-white">Forms</span>
                </Link>

                {/* Comp Exam - Orange gradient */}
                <Link to="/comp-exam" className="group relative col-span-1 row-span-1 flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-np-orange to-np-coral p-3 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                    <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:translate-x-[200%]" />
                    <PiExam
                        size={28}
                        className="text-white transition-transform group-hover:scale-110"
                    />
                    <span className="text-xs font-medium text-white">Comp Exam</span>
                </Link>
            </div>
        </div>
    );
};

export default BentoBox;
