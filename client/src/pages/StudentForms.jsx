import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { FiFileText, FiExternalLink, FiPlus, FiTrash2, FiX, FiSearch, FiFilter } from 'react-icons/fi';
import { HiOutlineServer, HiOutlineAcademicCap, HiOutlineSupport, HiOutlineClipboardList, HiOutlineDocumentText, HiOutlineCollection } from 'react-icons/hi';

const STORAGE_KEY = 'cslab-student-forms';

const CATEGORY_CONFIG = {
  'Server & Database': { icon: HiOutlineServer, color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
  'Course Related': { icon: HiOutlineAcademicCap, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
  'IT Support': { icon: HiOutlineSupport, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  'Registration': { icon: HiOutlineClipboardList, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  'Feedback': { icon: HiOutlineDocumentText, color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
  'Other': { icon: HiOutlineCollection, color: 'from-stone-500 to-stone-600', bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700' },
};

const DEFAULT_FORMS = [
  {
    id: 'default-sd-access',
    title: 'Server & Database Access Request',
    description: 'Request access to the Hydra Server and MariaDB database for development and learning. Once approved, you will receive credentials and setup instructions via email.',
    category: 'Server & Database',
    formUrl: '',
    isDefault: true,
    internalRoute: '/submit-sd-request',
  },
];

const StudentForms = () => {
  const { isAdmin } = useAuth();
  const [forms, setForms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCard, setExpandedCard] = useState(null);

  // Load forms from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setForms([...DEFAULT_FORMS, ...parsed]);
      } catch {
        setForms([...DEFAULT_FORMS]);
      }
    } else {
      setForms([...DEFAULT_FORMS]);
    }
  }, []);

  // Save custom forms to localStorage
  const saveCustomForms = (allForms) => {
    const custom = allForms.filter(f => !f.isDefault);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
  };

  const handleAddForm = (newForm) => {
    const form = {
      ...newForm,
      id: `form-${Date.now()}`,
      isDefault: false,
    };
    const updated = [...forms, form];
    setForms(updated);
    saveCustomForms(updated);
    setShowAddModal(false);
  };

  const handleDeleteForm = (formId) => {
    if (!window.confirm('Are you sure you want to remove this form?')) return;
    const updated = forms.filter(f => f.id !== formId);
    setForms(updated);
    saveCustomForms(updated);
  };

  const categories = ['All', ...Object.keys(CATEGORY_CONFIG)];

  const filteredForms = forms
    .filter(f => selectedCategory === 'All' || f.category === selectedCategory)
    .filter(f =>
      !searchQuery ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-orange-400 shadow-lg mb-4">
          <FiFileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-stone-800 mb-3">Student Forms</h1>
        <p className="text-lg text-stone-500 max-w-2xl mx-auto">
          Browse and access forms for student requests, registrations, and submissions. Click any form to view details and access the submission link.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all text-stone-700"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-9 pr-8 py-3 border border-stone-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all text-stone-700 appearance-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-400 to-orange-400 text-white font-medium rounded-xl shadow-sm hover:shadow-md hover:brightness-105 transition-all"
          >
            <FiPlus className="w-5 h-5" /> Add Form
          </button>
        )}
      </div>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFileText className="w-8 h-8 text-stone-400" />
          </div>
          <p className="text-stone-500 text-lg">No forms found</p>
          <p className="text-stone-400 text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredForms.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              isAdmin={isAdmin}
              expanded={expandedCard === form.id}
              onToggle={() => setExpandedCard(expandedCard === form.id ? null : form.id)}
              onDelete={() => handleDeleteForm(form.id)}
            />
          ))}
        </div>
      )}

      {/* Add Form Modal */}
      {showAddModal && (
        <AddFormModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddForm}
        />
      )}
    </div>
  );
};

function FormCard({ form, isAdmin, expanded, onToggle, onDelete }) {
  const config = CATEGORY_CONFIG[form.category] || CATEGORY_CONFIG['Other'];
  const Icon = config.icon;

  const handleAction = () => {
    if (form.internalRoute) {
      window.location.href = form.internalRoute;
    } else if (form.formUrl) {
      window.open(form.formUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const hasLink = form.formUrl || form.internalRoute;

  return (
    <div
      className={`group relative rounded-2xl border ${config.border} bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden`}
    >
      {/* Category Header */}
      <div className={`h-2 bg-gradient-to-r ${config.color}`} />

      <div className="p-5">
        {/* Category Badge + Admin Delete */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text}`}>
            <Icon className="w-3.5 h-3.5" />
            {form.category}
          </span>
          {isAdmin && !form.isDefault && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Remove form"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-stone-800 mb-2 leading-tight">
          {form.title}
        </h3>

        {/* Description - toggleable */}
        <p className={`text-sm text-stone-500 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
          {form.description}
        </p>

        {form.description.length > 120 && (
          <button
            onClick={onToggle}
            className="text-xs font-medium text-rose-500 hover:text-rose-600 mt-1 transition-colors"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Action Button */}
        <div className="mt-4">
          {hasLink ? (
            <button
              onClick={handleAction}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${config.color} shadow-sm hover:shadow-md hover:brightness-105 transition-all`}
            >
              {form.internalRoute ? 'Open Form' : 'Open in Microsoft Forms'}
              <FiExternalLink className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-stone-400 bg-stone-100 border border-dashed border-stone-300">
              Form link not yet added
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddFormModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [formUrl, setFormUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    onAdd({ title: title.trim(), description: description.trim(), category, formUrl: formUrl.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <div>
            <h2 className="text-xl font-bold text-stone-800">Add New Form</h2>
            <p className="text-sm text-stone-500 mt-0.5">Create a form card for students to access</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-stone-700">
              Form Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. Course Override Request"
              className="px-4 py-3 border border-stone-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all text-stone-800 placeholder-stone-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-stone-700">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(''); }}
              rows={4}
              placeholder="Describe what this form is for and what students need to know before filling it out..."
              className="px-4 py-3 border border-stone-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all text-stone-800 placeholder-stone-400 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-stone-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border border-stone-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all text-stone-800 appearance-none cursor-pointer"
            >
              {Object.keys(CATEGORY_CONFIG).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-stone-700">Microsoft Forms URL</label>
            <input
              type="url"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://forms.office.com/..."
              className="px-4 py-3 border border-stone-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all text-stone-800 placeholder-stone-400"
            />
            <span className="text-xs text-stone-400">Paste the full Microsoft Forms link here. You can add it later too.</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-400 to-orange-400 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:brightness-105 transition-all"
            >
              Add Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForms;
