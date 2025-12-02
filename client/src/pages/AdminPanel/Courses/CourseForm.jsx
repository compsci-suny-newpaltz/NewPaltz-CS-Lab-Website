import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaUpload, FaUser, FaHistory, FaFileAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import courseService from '../../../services/courseService';

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

const semesters = [
  'Spring 2024', 'Fall 2024', 'Spring 2025', 'Fall 2025',
  'Spring 2026', 'Fall 2026', 'Spring 2027', 'Fall 2027'
];

const CourseForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    professors: true,
    syllabi: true,
    resources: true
  });

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    section: '01',
    professor: '',
    professors: [], // Array of professors teaching this course
    semester: 'Fall 2025',
    description: '',
    syllabusFile: '',
    syllabi: [], // Array of syllabi over the years
    category: 'core',
    color: 'bg-blue-200',
    crn: '',
    credits: 3,
    days: '',
    time: '',
    location: '',
    prerequisites: '',
    resources: []
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchCourse();
    }
  }, [isEdit, id]);

  const fetchCourse = async () => {
    try {
      const data = await courseService.getCourseByID(id);
      // Convert legacy professor field to professors array if needed
      let professors = data.professors || [];
      if (!professors.length && data.professor) {
        professors = [{ name: data.professor, isPrimary: true }];
      }
      // Convert legacy syllabusFile to syllabi array if needed
      let syllabi = data.syllabi || [];
      if (!syllabi.length && data.syllabusFile) {
        syllabi = [{
          semester: data.semester || 'Fall 2025',
          file: data.syllabusFile,
          professor: data.professor || ''
        }];
      }
      setFormData({
        ...data,
        professors,
        syllabi,
        resources: data.resources || []
      });
    } catch (err) {
      console.error('Error fetching course:', err);
      alert('Failed to load course data');
      navigate('/admin-panel');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSyllabusFile(e.target.files[0]);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Professor management
  const addProfessor = () => {
    setFormData(prev => ({
      ...prev,
      professors: [...prev.professors, { name: '', isPrimary: prev.professors.length === 0, section: '', email: '' }]
    }));
  };

  const updateProfessor = (index, field, value) => {
    const newProfessors = [...formData.professors];
    newProfessors[index] = { ...newProfessors[index], [field]: value };
    // If setting as primary, unset others
    if (field === 'isPrimary' && value) {
      newProfessors.forEach((p, i) => {
        if (i !== index) p.isPrimary = false;
      });
    }
    setFormData(prev => ({ ...prev, professors: newProfessors }));
  };

  const removeProfessor = (index) => {
    const newProfessors = formData.professors.filter((_, i) => i !== index);
    // Ensure at least one is primary if any exist
    if (newProfessors.length > 0 && !newProfessors.some(p => p.isPrimary)) {
      newProfessors[0].isPrimary = true;
    }
    setFormData(prev => ({ ...prev, professors: newProfessors }));
  };

  // Syllabus history management
  const addSyllabus = () => {
    setFormData(prev => ({
      ...prev,
      syllabi: [...prev.syllabi, { semester: 'Fall 2025', file: '', professor: '', notes: '' }]
    }));
  };

  const updateSyllabus = (index, field, value) => {
    const newSyllabi = [...formData.syllabi];
    newSyllabi[index] = { ...newSyllabi[index], [field]: value };
    setFormData(prev => ({ ...prev, syllabi: newSyllabi }));
  };

  const removeSyllabus = (index) => {
    setFormData(prev => ({
      ...prev,
      syllabi: prev.syllabi.filter((_, i) => i !== index)
    }));
  };

  // Resource management
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
    setSaving(true);

    try {
      const submitData = new FormData();

      // Build professor string from array (for backwards compatibility)
      const primaryProfessor = formData.professors.find(p => p.isPrimary)?.name ||
                               formData.professors[0]?.name ||
                               formData.professor;

      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'resources' || key === 'professors' || key === 'syllabi') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'professor') {
          submitData.append(key, primaryProfessor);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      // Add syllabus file if selected
      if (syllabusFile) {
        submitData.append('syllabusFile', syllabusFile);
      }

      if (isEdit) {
        await courseService.editCourse(id, submitData);
      } else {
        await courseService.addCourse(submitData);
      }

      navigate('/admin-panel');
    } catch (err) {
      console.error('Error saving course:', err);
      alert('Failed to save course. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin-panel')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Course' : 'Add New Course'}
          </h1>
          <p className="text-sm text-gray-500">Manage course details, professors, and syllabi</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., CPS 210"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder="e.g., 01"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credits
              </label>
              <input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                min="1"
                max="6"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Computer Science I: Foundations"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of the course..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none resize-none"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prerequisites
              </label>
              <input
                type="text"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                placeholder="e.g., CPS 210 or instructor permission"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Professors Section */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('professors')}
            className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500 rounded-lg">
                <FaUser className="text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-800">Professors</h2>
                <p className="text-sm text-gray-500">{formData.professors.length} professor(s) assigned</p>
              </div>
            </div>
            {expandedSections.professors ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </button>

          {expandedSections.professors && (
            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">Add multiple professors who teach different sections of this course.</p>
                <button
                  type="button"
                  onClick={addProfessor}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 transition-colors text-sm font-medium"
                >
                  <FaPlus />
                  Add Professor
                </button>
              </div>

              {formData.professors.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FaUser className="mx-auto text-3xl text-gray-300 mb-2" />
                  <p className="text-gray-500">No professors added yet.</p>
                  <button
                    type="button"
                    onClick={addProfessor}
                    className="mt-3 text-violet-600 hover:text-violet-700 font-medium text-sm"
                  >
                    + Add your first professor
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.professors.map((prof, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
                            <input
                              type="text"
                              value={prof.name}
                              onChange={(e) => updateProfessor(index, 'name', e.target.value)}
                              placeholder="Dr. John Smith"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-violet-300 focus:outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Section(s)</label>
                            <input
                              type="text"
                              value={prof.section || ''}
                              onChange={(e) => updateProfessor(index, 'section', e.target.value)}
                              placeholder="01, 02"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-violet-300 focus:outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                            <input
                              type="email"
                              value={prof.email || ''}
                              onChange={(e) => updateProfessor(index, 'email', e.target.value)}
                              placeholder="smith@newpaltz.edu"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-violet-300 focus:outline-none text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border cursor-pointer hover:bg-violet-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={prof.isPrimary}
                              onChange={(e) => updateProfessor(index, 'isPrimary', e.target.checked)}
                              className="accent-violet-500"
                            />
                            <span className="text-xs text-gray-600">Primary</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeProfessor(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Schedule Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Schedule & Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CRN
              </label>
              <input
                type="text"
                name="crn"
                value={formData.crn}
                onChange={handleChange}
                placeholder="e.g., 724"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none"
              >
                {semesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days
              </label>
              <input
                type="text"
                name="days"
                value={formData.days}
                onChange={handleChange}
                placeholder="e.g., MR"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g., 9:30 AM-10:45 AM"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., SH 181"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Appearance & Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Color
              </label>
              <select
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-rose-300 focus:outline-none"
              >
                {colors.map(color => (
                  <option key={color.id} value={color.id}>{color.name}</option>
                ))}
              </select>
            </div>

            {/* Color Preview */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview
              </label>
              <div className={`${formData.color} p-4 rounded-lg`}>
                <span className="font-medium">{formData.code || 'CPS XXX'}</span> - {formData.name || 'Course Name'}
              </div>
            </div>
          </div>
        </div>

        {/* Syllabi History Section */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('syllabi')}
            className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <FaHistory className="text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-800">Syllabi History</h2>
                <p className="text-sm text-gray-500">{formData.syllabi.length} syllabus/syllabi across semesters</p>
              </div>
            </div>
            {expandedSections.syllabi ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </button>

          {expandedSections.syllabi && (
            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">Track syllabi across different semesters and professors.</p>
                <button
                  type="button"
                  onClick={addSyllabus}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
                >
                  <FaPlus />
                  Add Syllabus
                </button>
              </div>

              {/* Current Syllabus Upload */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <FaFileAlt className="text-blue-500" />
                  <span className="font-medium text-blue-800">Current Semester Syllabus</span>
                </div>

                {formData.syllabusFile && !syllabusFile && (
                  <div className="mb-3 p-3 bg-green-100 rounded-lg text-green-700 text-sm">
                    Current file: {formData.syllabusFile.split('/').pop()}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors">
                    <FaUpload className="text-blue-500" />
                    <span className="text-sm">{syllabusFile ? 'Change File' : 'Upload Syllabus'}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {syllabusFile && (
                    <span className="text-sm text-gray-600">{syllabusFile.name}</span>
                  )}
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Or enter a path to an existing file:
                </p>
                <input
                  type="text"
                  name="syllabusFile"
                  value={formData.syllabusFile}
                  onChange={handleChange}
                  placeholder="/syllabi/filename.pdf"
                  className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:outline-none text-sm"
                />
              </div>

              {/* Historical Syllabi */}
              {formData.syllabi.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FaHistory className="mx-auto text-3xl text-gray-300 mb-2" />
                  <p className="text-gray-500">No historical syllabi recorded.</p>
                  <button
                    type="button"
                    onClick={addSyllabus}
                    className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    + Add a past syllabus
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Historical Syllabi</h3>
                  {formData.syllabi.map((syl, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Semester</label>
                            <select
                              value={syl.semester}
                              onChange={(e) => updateSyllabus(index, 'semester', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-emerald-300 focus:outline-none text-sm"
                            >
                              {semesters.map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Professor</label>
                            <input
                              type="text"
                              value={syl.professor || ''}
                              onChange={(e) => updateSyllabus(index, 'professor', e.target.value)}
                              placeholder="Professor name"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-emerald-300 focus:outline-none text-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">File Path / URL</label>
                            <input
                              type="text"
                              value={syl.file || ''}
                              onChange={(e) => updateSyllabus(index, 'file', e.target.value)}
                              placeholder="/syllabi/CPS210_Fall2024.pdf"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-emerald-300 focus:outline-none text-sm"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSyllabus(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resources Section */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('resources')}
            className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <FaFileAlt className="text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-800">Helpful Resources</h2>
                <p className="text-sm text-gray-500">{formData.resources.length} resource(s) linked</p>
              </div>
            </div>
            {expandedSections.resources ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </button>

          {expandedSections.resources && (
            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">Add helpful links for students taking this course.</p>
                <button
                  type="button"
                  onClick={addResource}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
                >
                  <FaPlus />
                  Add Resource
                </button>
              </div>

              {formData.resources.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FaFileAlt className="mx-auto text-3xl text-gray-300 mb-2" />
                  <p className="text-gray-500">No resources added yet.</p>
                  <button
                    type="button"
                    onClick={addResource}
                    className="mt-3 text-amber-600 hover:text-amber-700 font-medium text-sm"
                  >
                    + Add a helpful resource
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.resources.map((resource, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={resource.name}
                            onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                            placeholder="Resource Name"
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-amber-300 focus:outline-none text-sm"
                          />
                          <input
                            type="url"
                            value={resource.url}
                            onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-amber-300 focus:outline-none text-sm"
                          />
                          <input
                            type="text"
                            value={resource.description}
                            onChange={(e) => handleResourceChange(index, 'description', e.target.value)}
                            placeholder="Brief description"
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-amber-300 focus:outline-none text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeResource(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 sticky bottom-6">
          <button
            type="button"
            onClick={() => navigate('/admin-panel')}
            className="px-6 py-3 bg-white text-gray-600 hover:bg-gray-100 rounded-xl transition-colors shadow-lg border border-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 font-medium"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                {isEdit ? 'Update Course' : 'Create Course'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
