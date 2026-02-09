import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaUpload, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import courseService from '../../services/courseService';

const categories = [
  { id: 'introductory', name: 'Introductory' },
  { id: 'core', name: 'Core CS' },
  { id: 'systems', name: 'Systems' },
  { id: 'software', name: 'Software Engineering' },
  { id: 'theory', name: 'Theory' },
  { id: 'ai', name: 'AI & Data Science' },
  { id: 'security', name: 'Security' },
  { id: 'capstone', name: 'Capstone' },
  { id: 'graduate', name: 'Graduate' }
];

const colors = [
  { id: 'bg-blue-200', name: 'Blue' },
  { id: 'bg-green-200', name: 'Green' },
  { id: 'bg-purple-200', name: 'Purple' },
  { id: 'bg-indigo-200', name: 'Indigo' },
  { id: 'bg-rose-200', name: 'Rose' },
  { id: 'bg-amber-200', name: 'Amber' },
  { id: 'bg-orange-200', name: 'Orange' },
  { id: 'bg-teal-200', name: 'Teal' },
  { id: 'bg-cyan-200', name: 'Cyan' },
  { id: 'bg-lime-200', name: 'Lime' },
  { id: 'bg-fuchsia-200', name: 'Fuchsia' },
  { id: 'bg-yellow-200', name: 'Yellow' },
  { id: 'bg-red-200', name: 'Red' },
  { id: 'bg-violet-200', name: 'Violet' },
  { id: 'bg-emerald-200', name: 'Emerald' },
  { id: 'bg-slate-200', name: 'Slate' },
  { id: 'bg-sky-200', name: 'Sky' },
  { id: 'bg-pink-200', name: 'Pink' }
];

export default function EditCourseModal({ isOpen, onClose, onSuccess, courseData, courseId }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    code: '', name: '', section: '01', professor: '', semester: '',
    description: '', syllabusFile: '', category: 'core', color: 'bg-blue-200',
    crn: '', credits: 3, days: '', time: '', location: '', resources: []
  });

  useEffect(() => {
    if (isOpen && courseData) {
      setFormData({
        code: courseData.code || '',
        name: courseData.name || '',
        section: courseData.section || '01',
        professor: courseData.professor || '',
        semester: courseData.semester || '',
        description: courseData.description || '',
        syllabusFile: courseData.syllabusFile || '',
        category: courseData.category || 'core',
        color: courseData.color || 'bg-blue-200',
        crn: courseData.crn || '',
        credits: courseData.credits || 3,
        days: courseData.days || '',
        time: courseData.time || '',
        location: courseData.location || '',
        resources: courseData.resources || []
      });
      setSyllabusFile(null);
      setError('');
      setShowDeleteConfirm(false);
    }
  }, [isOpen, courseData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setSyllabusFile(e.target.files[0]);
  };

  const handleResourceChange = (index, field, value) => {
    const newResources = [...formData.resources];
    newResources[index] = { ...newResources[index], [field]: value };
    setFormData(prev => ({ ...prev, resources: newResources }));
  };

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { name: '', url: '', description: '' }]
    }));
  };

  const removeResource = (index) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      setError('Course code and name are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'resources') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });
      if (syllabusFile) {
        submitData.append('syllabusFile', syllabusFile);
      }
      await courseService.editCourse(courseId, submitData);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    setError('');
    try {
      await courseService.deleteCourse(courseId);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8"
         onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4"
           onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-500 to-orange-400 rounded-t-2xl">
          <h2 className="text-lg font-bold text-white">Edit Course</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <FaTimes size={18} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Basic Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input type="text" name="code" value={formData.code} onChange={handleChange} required
                  placeholder="CPS 210"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <input type="text" name="section" value={formData.section} onChange={handleChange}
                  placeholder="01"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  placeholder="Computer Science I: Foundations"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professor</label>
                <input type="text" name="professor" value={formData.professor} onChange={handleChange}
                  placeholder="Katherine Brainard"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <input type="text" name="semester" value={formData.semester} onChange={handleChange}
                  placeholder="Fall 2025"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={2}
                  placeholder="Brief description..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm resize-none" />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Schedule & Location</h3>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CRN</label>
                <input type="text" name="crn" value={formData.crn} onChange={handleChange}
                  placeholder="724"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                <input type="number" name="credits" value={formData.credits} onChange={handleChange} min="1" max="6"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                <input type="text" name="days" value={formData.days} onChange={handleChange}
                  placeholder="MR"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input type="text" name="time" value={formData.time} onChange={handleChange}
                  placeholder="9:30 AM-10:45 AM"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm" />
              </div>
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange}
                  placeholder="SH 181"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm" />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Appearance & Category</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm">
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Color</label>
                <select name="color" value={formData.color} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-sm">
                  {colors.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <div className={`${formData.color} p-3 rounded-lg text-sm`}>
                  <span className="font-medium">{formData.code || 'CPS XXX'}</span> - {formData.name || 'Course Name'}
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Syllabus</h3>
            {formData.syllabusFile && !syllabusFile && (
              <div className="mb-2 p-2 bg-green-50 rounded-lg text-green-700 text-xs">
                Current: {formData.syllabusFile.split('/').pop()}
              </div>
            )}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors text-sm">
                <FaUpload className="text-xs" />
                {syllabusFile ? 'Change' : 'Upload'}
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
              </label>
              {syllabusFile && <span className="text-xs text-gray-600">{syllabusFile.name}</span>}
            </div>
            <input type="text" name="syllabusFile" value={formData.syllabusFile} onChange={handleChange}
              placeholder="/syllabi/filename.pdf"
              className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none text-xs" />
          </div>

          {/* Resources */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Resources</h3>
              <button type="button" onClick={addResource}
                className="flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors text-xs">
                <FaPlus className="text-[10px]" /> Add
              </button>
            </div>
            {formData.resources.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-3">No resources. Click "Add" to add links.</p>
            ) : (
              <div className="space-y-2">
                {formData.resources.map((resource, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <input type="text" value={resource.name} onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                      placeholder="Name" className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs focus:border-rose-300 focus:outline-none" />
                    <input type="url" value={resource.url} onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                      placeholder="https://..." className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs focus:border-rose-300 focus:outline-none" />
                    <input type="text" value={resource.description} onChange={(e) => handleResourceChange(index, 'description', e.target.value)}
                      placeholder="Description" className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs focus:border-rose-300 focus:outline-none" />
                    <button type="button" onClick={() => removeResource(index)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete Zone */}
          <div className="border-t border-gray-200 pt-4">
            {!showDeleteConfirm ? (
              <button type="button" onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors">
                Delete this course...
              </button>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-700 flex-1">Permanently delete this course?</span>
                <button type="button" onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded transition-colors">Cancel</button>
                <button type="button" onClick={handleDelete} disabled={saving}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50">Delete</button>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-rose-500 text-white text-sm rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50">
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : (
              <><FaSave /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
