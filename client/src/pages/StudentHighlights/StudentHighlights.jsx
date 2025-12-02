import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaGithub, FaChevronLeft, FaChevronRight, FaStar, FaCode } from "react-icons/fa";
import studentHighlightService from "../../services/studentHighlightService";

const gradients = [
  'from-violet-500 via-purple-500 to-indigo-500',
  'from-rose-500 via-pink-500 to-fuchsia-500',
  'from-cyan-500 via-teal-500 to-emerald-500',
  'from-amber-500 via-orange-500 to-red-500',
  'from-blue-500 via-indigo-500 to-violet-500',
  'from-emerald-500 via-green-500 to-teal-500',
];

function ProjectCard({ post }) {
  if (!post) return null;

  const colorIndex = Math.abs(
    (post.id || post.project_title || "x")
      .toString()
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  ) % gradients.length;

  const gradient = gradients[colorIndex];
  const projectTitle = post.project_title || 'Untitled Project';
  const studentName = post.student_name || 'Unknown Student';
  const summary = post.summary || 'No description available.';

  return (
    <div className="group h-full">
      <div className={`h-full rounded-2xl bg-gradient-to-br ${gradient} p-[2px] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
        <div className="h-full bg-white rounded-[14px] p-5 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <span className={`px-3 py-1 bg-gradient-to-r ${gradient} rounded-full text-xs font-bold text-white shadow-sm`}>
              {post.category || "Project"}
            </span>
            <FaStar className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-gray-900 transition-colors">
            {projectTitle}
          </h3>

          <p className="text-sm text-gray-500 mb-3">
            by <span className="font-medium text-gray-700">{studentName}</span>
          </p>

          <p className="text-sm text-gray-600 line-clamp-3 flex-grow mb-4">
            {summary}
          </p>

          {post.github_link && (
            <a
              href={post.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity mt-auto`}
            >
              <FaGithub className="text-gray-700" />
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentHighlights() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('recent posts');
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await studentHighlightService.getAllPosts();
        setBlogPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  const categories = ['recent posts', 'programming', 'web development', 'cybersecurity', 'artificial intelligence', 'Technical Interviews'];

  const filteredResources = selectedCategory === 'recent posts'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentResources = filteredResources.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredResources.length / cardsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="relative mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                  <FaCode className="text-white text-xl" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Student Projects
                </h1>
              </div>
              <p className="text-gray-500 text-lg">
                Showcasing innovative work from our talented students
              </p>
            </div>

            <Link to="/submit-project">
              <button className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                Submit Project
              </button>
            </Link>
          </div>

          {/* Category Filter */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500 bg-red-50 inline-block px-6 py-3 rounded-xl">{error}</p>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentResources.map((post) => (
              <ProjectCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredResources.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <FaCode className="text-4xl text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No projects found in this category.</p>
            <p className="text-gray-400 mt-2">Be the first to submit one!</p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredResources.length > cardsPerPage && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <FaChevronLeft className="text-sm" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Next
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}