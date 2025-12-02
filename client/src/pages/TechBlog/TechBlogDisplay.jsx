import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaNewspaper, FaBookmark } from "react-icons/fa";
import techBlogService from "../../services/techBlogService";

const gradients = [
  'from-cyan-500 via-blue-500 to-indigo-500',
  'from-emerald-500 via-teal-500 to-cyan-500',
  'from-orange-500 via-amber-500 to-yellow-500',
  'from-pink-500 via-rose-500 to-red-500',
  'from-violet-500 via-purple-500 to-fuchsia-500',
  'from-lime-500 via-green-500 to-emerald-500',
];

function ArticleCard({ post }) {
  const colorIndex = Math.abs(
    (post.id || post.title || "x")
      .toString()
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  ) % gradients.length;

  const gradient = gradients[colorIndex];
  const img = post.img || null;

  return (
    <div className="group h-full">
      <div className={`h-full rounded-2xl bg-gradient-to-br ${gradient} p-[2px] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
        <div className="h-full bg-white rounded-[14px] overflow-hidden flex flex-col">
          {img && (
            <div className="relative h-40 overflow-hidden">
              <img
                src={img}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent`}></div>
            </div>
          )}

          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-start justify-between mb-3">
              <span className={`px-3 py-1 bg-gradient-to-r ${gradient} rounded-full text-xs font-bold text-white shadow-sm`}>
                {post.category || "Article"}
              </span>
              <FaBookmark className="text-gray-300 group-hover:text-amber-400 transition-colors duration-300 cursor-pointer" />
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-gray-900 transition-colors">
              {post.title}
            </h3>

            <p className="text-sm text-gray-500 mb-3">
              by <span className="font-medium text-gray-700">{post.author_name || 'Anonymous'}</span>
            </p>

            <p className="text-sm text-gray-600 line-clamp-3 flex-grow mb-4">
              {post.summary || 'No description available.'}
            </p>

            {post.external_link && (
              <a
                href={post.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity mt-auto`}
              >
                <FaExternalLinkAlt className="text-gray-500 text-xs" />
                Read Article
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TechBlogDisplay() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('recent posts');
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await techBlogService.getAllArticles();
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

  const filteredPosts = selectedCategory === 'recent posts'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredPosts.length / cardsPerPage);

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
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                  <FaNewspaper className="text-white text-xl" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Tech Articles
                </h1>
              </div>
              <p className="text-gray-500 text-lg">
                Insights, tutorials, and tech news from our community
              </p>
            </div>

            <Link to="/submit-article">
              <button className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                Submit Article
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
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
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
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500 bg-red-50 inline-block px-6 py-3 rounded-xl">{error}</p>
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <FaNewspaper className="text-4xl text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No articles found in this category.</p>
            <p className="text-gray-400 mt-2">Be the first to contribute!</p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredPosts.length > cardsPerPage && (
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
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
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

