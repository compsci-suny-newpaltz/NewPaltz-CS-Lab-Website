import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaSearch, FaGraduationCap, FaPlus } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import courseService from '../../services/courseService';
import staticCoursesData from '../../data/coursesData';
import { useAuth } from '../../context/authContext';
import AddCourseModal from '../../components/Courses/AddCourseModal';

// Group courses by course code AND name
const groupCoursesByCodeAndName = (courses) => {
  const grouped = {};

  courses.forEach(course => {
    const baseCode = course.code.split('/')[0].trim();
    const key = `${baseCode}__${course.name}`;

    if (!grouped[key]) {
      grouped[key] = {
        code: baseCode,
        name: course.name,
        category: course.category,
        credits: course.credits,
        slug: course.slug || course.code.toLowerCase().replace(/\s+/g, ''),
        sections: []
      };
    }

    grouped[key].sections.push({
      id: course.id,
      section: course.section,
      professor: course.professor
    });
  });

  return Object.values(grouped);
};

// Get course level from code
const getCourseLevel = (code) => {
  const num = parseInt(code.replace(/\D/g, ''));
  if (num >= 500) return 'graduate';
  if (num >= 400) return '400';
  if (num >= 300) return '300';
  if (num >= 200) return '200';
  return '100';
};

const LEVEL_TABS = [
  { id: 'all', label: 'All Courses', icon: HiAcademicCap },
  { id: '100', label: '100 Level' },
  { id: '200', label: '200 Level' },
  { id: '300', label: '300 Level' },
  { id: '400', label: '400 Level' },
  { id: 'graduate', label: 'Graduate', icon: FaGraduationCap },
];

const CourseCard = ({ course }) => {
  const level = getCourseLevel(course.code);
  const sectionCount = course.sections?.length || 1;

  // SUNY New Paltz brand colors
  const levelColors = {
    '100': 'from-np-cyan to-np-blue-400',
    '200': 'from-np-blue to-np-blue-700',
    '300': 'from-np-orange to-np-coral',
    '400': 'from-np-gold to-np-orange',
    'graduate': 'from-np-rust to-np-orange-600',
  };

  const colorClass = levelColors[level] || 'from-gray-400 to-gray-500';

  return (
    <Link
      to={`/courses/${course.slug || course.code.toLowerCase().replace(/\s+/g, '')}`}
      className="block"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 h-full
                    border border-gray-100 hover:border-np-orange-200 hover:-translate-y-1">
        {/* Code Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className={`px-3 py-1 bg-gradient-to-r ${colorClass} rounded-lg text-xs font-bold text-white`}>
            {course.code}
          </span>
          <span className="text-xs text-gray-500">{course.credits || 3} cr</span>
        </div>

        {/* Course Name */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-tight">
          {course.name}
        </h3>

        {/* Section count */}
        {sectionCount > 1 && (
          <p className="text-xs text-gray-400">{sectionCount} sections</p>
        )}
      </div>
    </Link>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState(staticCoursesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const { isAdmin, isFaculty } = useAuth();

  const canManageCourses = isAdmin || isFaculty;

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      if (data && data.length > 0) {
        setCourses(data);
      }
    } catch (err) {
      console.log('Using static course data');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Group courses
  const groupedCourses = groupCoursesByCodeAndName(courses);

  // Filter by search and tab
  const filteredCourses = groupedCourses.filter(course => {
    if (activeTab !== 'all') {
      const level = getCourseLevel(course.code);
      if (level !== activeTab) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        course.name.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query)
      );
    }

    return true;
  }).sort((a, b) => {
    const numA = parseInt(a.code.replace(/\D/g, ''));
    const numB = parseInt(b.code.replace(/\D/g, ''));
    return numA - numB;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-np-blue to-np-blue-700 rounded-2xl shadow-lg mb-4">
            <HiAcademicCap className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-2">
            <span className="bg-gradient-to-r from-np-blue via-np-blue-400 to-np-orange bg-clip-text text-transparent">
              CS Department Courses
            </span>
          </h1>
          <p className="text-gray-500">
            {groupedCourses.length} courses • Click any course to see details and syllabus
          </p>
          
          {/* Add Course Button - Faculty/Admin Only */}
          {canManageCourses && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-np-blue to-np-orange text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all"
            >
              <FaPlus /> Add Course
            </button>
          )}
        </div>

        {/* Notice Banner */}
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-800 text-sm text-center">
            <span className="font-semibold">Note:</span> Course listings may not be current. For up-to-date course offerings and sections, please check the{' '}
            <a
              href="https://schedule.newpaltz.edu/classes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-np-blue hover:text-np-orange underline font-medium"
            >
              Schedule of Classes
            </a>.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-lg mx-auto mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white shadow-md border border-gray-200
                       focus:border-np-blue-300 focus:ring-2 focus:ring-np-blue-100 focus:outline-none
                       placeholder-gray-400 text-gray-700"
            />
          </div>
        </div>

        {/* Level Tabs */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max justify-center">
            {LEVEL_TABS.map(tab => {
              const count = tab.id === 'all'
                ? groupedCourses.length
                : groupedCourses.filter(c => getCourseLevel(c.code) === tab.id).length;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-np-blue to-np-orange text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {Icon && <Icon className="text-sm" />}
                    {tab.label}
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Grid - 4 columns minimum on large screens */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-5xl mb-3">📚</div>
            <p className="text-gray-500">No courses found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-4 py-2 bg-np-orange text-white rounded-lg text-sm"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredCourses.map(course => (
              <CourseCard key={`${course.code}__${course.name}`} course={course} />
            ))}
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-10 pt-6 border-t border-np-gray-light text-center text-sm text-gray-500">
          <span className="text-np-blue font-medium">{filteredCourses.length}</span> of <span className="text-np-orange font-medium">{groupedCourses.length}</span> courses
        </div>
      </div>

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchCourses}
      />
    </div>
  );
};

export default Courses;
