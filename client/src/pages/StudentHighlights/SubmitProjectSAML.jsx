import { useState } from 'react';
import { useSAMLAuth } from '../../context/samlAuthContext';
import { FaGithub, FaGlobe, FaImage, FaUser, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default function SubmitProjectSAML() {
    const { user, isAuthenticated, loading, login } = useSAMLAuth();

    const [formData, setFormData] = useState({
        project_title: '',
        summary: '',
        project_description: '',
        project_link: '',
        github_link: '',
        banner_image: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent" />
            </div>
        );
    }

    // Not authenticated - show login prompt
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-2xl mx-auto px-6 py-20 text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-10">
                        <FaLock className="mx-auto text-5xl text-violet-500 mb-6" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            New Paltz Login Required
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Sign in with your New Paltz account to submit a project.
                            Your name and email will be automatically filled in.
                        </p>
                        <button
                            onClick={() => login('/submit-project')}
                            className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            Sign In with New Paltz
                        </button>
                        <div className="mt-6">
                            <Link
                                to="/student-highlights"
                                className="text-violet-600 hover:underline flex items-center justify-center gap-2"
                            >
                                <FaArrowLeft /> Back to Student Projects
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/student-highlights/submit-authenticated`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to submit project. Please try again.');
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError('Error submitting project. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Successfully submitted
    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-2xl mx-auto px-6 py-20 text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-10">
                        <div className="text-6xl mb-6">🎉</div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            Project Submitted!
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Your project has been submitted and is awaiting review by an admin.
                            You'll see it on the Student Projects page once it's approved!
                        </p>
                        <Link
                            to="/student-highlights"
                            className="inline-flex items-center gap-2 text-violet-600 font-medium hover:underline"
                        >
                            <FaArrowLeft /> Back to Student Projects
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-3xl mx-auto px-6 py-10">
                {/* Header with user info */}
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
                    <h1 className="text-3xl font-bold mb-2">Submit Your Project</h1>
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <FaUser className="opacity-80" />
                            <span>{user.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaEnvelope className="opacity-80" />
                            <span>{user.email}</span>
                        </div>
                    </div>
                    <p className="text-white/80 text-sm mt-2">
                        Your name and email will be automatically attached to this submission.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Title */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.project_title}
                            onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-all"
                            placeholder="My Awesome Project"
                        />
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Short Summary <span className="text-red-500">*</span>
                            <span className="text-gray-400 font-normal ml-2">(max 300 chars)</span>
                        </label>
                        <textarea
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            maxLength={300}
                            required
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none resize-none transition-all"
                            placeholder="A brief description of your project..."
                        />
                        <div className="text-right text-xs text-gray-400 mt-1">
                            {formData.summary.length}/300
                        </div>
                    </div>

                    {/* Full Description */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.project_description}
                            onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
                            required
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none resize-none transition-all"
                            placeholder="Tell us more about your project, what it does, what technologies you used, challenges you overcame..."
                        />
                    </div>

                    {/* Links */}
                    <div className="bg-white rounded-xl shadow p-6 space-y-4">
                        <h3 className="font-medium text-gray-800">Project Links</h3>

                        <div className="flex items-center gap-3">
                            <FaGithub className="text-gray-400 text-xl flex-shrink-0" />
                            <input
                                type="url"
                                value={formData.github_link}
                                onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-all"
                                placeholder="https://github.com/username/repo"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <FaGlobe className="text-gray-400 text-xl flex-shrink-0" />
                            <input
                                type="url"
                                value={formData.project_link}
                                onChange={(e) => setFormData({ ...formData, project_link: e.target.value })}
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-all"
                                placeholder="https://myproject.com (live demo URL)"
                            />
                        </div>
                    </div>

                    {/* Banner Image */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <FaImage className="text-gray-400 text-xl" />
                            <label className="text-sm font-medium text-gray-700">
                                Banner Image URL
                                <span className="text-gray-400 font-normal ml-2">(optional)</span>
                            </label>
                        </div>
                        <input
                            type="url"
                            value={formData.banner_image}
                            onChange={(e) => setFormData({ ...formData, banner_image: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-all"
                            placeholder="https://example.com/banner.png"
                        />
                        {formData.banner_image && (
                            <div className="mt-4">
                                <img
                                    src={formData.banner_image}
                                    alt="Banner preview"
                                    className="rounded-lg max-h-48 object-cover w-full"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                Submitting...
                            </span>
                        ) : (
                            'Submit Project'
                        )}
                    </button>

                    <div className="text-center">
                        <Link
                            to="/student-highlights"
                            className="text-gray-500 hover:text-violet-600 text-sm"
                        >
                            Cancel and go back
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
