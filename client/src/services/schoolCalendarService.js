import axios from 'axios';

const baseURL = '/api/school-calendar';

const schoolCalendarService = {
  // School Calendar CRUD

  // Get all calendars
  async getAllCalendars() {
    try {
      const response = await axios.get(baseURL);
      return response.data;
    } catch (error) {
      throw new Error('Failed to load school calendars');
    }
  },

  // Get calendar by ID
  async getCalendarById(id) {
    console.log('📌 getCalendarById CALLED with id:', id);

    try {
      const url = `${baseURL}/${id}`;
      console.log('🌐 Requesting URL:', url);

      const response = await axios.get(url);

      console.log('✅ Response Status:', response.status);
      console.log('📦 Response Data:', response.data);

      return response.data;
    } catch (error) {
      console.log('❌ ERROR in getCalendarById:');

      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
        console.log('Headers:', error.response.headers);
      } else if (error.request) {
        console.log('🚫 No response received:', error.request);
      } else {
        console.log('⚠️ Error setting up request:', error.message);
      }

      throw new Error('Failed to load calendar');
    }
  },

  // Add a new calendar
  async addCalendar(calendarData) {
    console.log('Adding calendar with data:', calendarData);
    try {
      const response = await axios.post(baseURL, calendarData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to add calendar');
    }
  },

  // Edit calendar
  async editCalendar(id, updatedData) {
    try {
      const response = await axios.put(`${baseURL}/${id}`, updatedData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to edit calendar');
    }
  },

  // Delete calendar
  async deleteCalendar(id) {
    try {
      const response = await axios.delete(`${baseURL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete calendar');
    }
  },

  //No school days CRUD

  // Get all "no school" days for a calendar
  async getNoSchoolDays(calendarId) {
    try {
      const response = await axios.get(`${baseURL}/${calendarId}/no-school`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to load no school days');
    }
  },

  // Add a "no school" day
  async addNoSchoolDay(calendarId, day) {
    console.log('Adding no school day:', day, 'to calendar ID:', calendarId);
    try {
      const response = await axios.post(`${baseURL}/${calendarId}/no-school`, {
        Day: day,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add no school day');
    }
  },

  // Delete "no school" day by entryId
  async deleteNoSchoolDay(entryId) {
    try {
      const response = await axios.delete(`${baseURL}/no-school/${entryId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete no school day');
    }
  },

  // Faculty-Semester Assignments CRUD

  // Get assigned faculty for a semester
  async getFacultyForSemester(calendarId, semester) {
    try {
      const response = await axios.get(
        `${baseURL}/${calendarId}/semester/${semester}`
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to load faculty for semester');
    }
  },

  // Assign faculty to a semester
  async addFacultyToSemester(calendarId, facultyId, semester) {
    try {
      const response = await axios.post(`${baseURL}/${calendarId}/semester`, {
        FacultyId: facultyId,
        Semester: semester,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to assign faculty to semester');
    }
  },

  // Remove faculty from a semester
  async deleteFacultyFromSemester(entryId) {
    try {
      const response = await axios.delete(`${baseURL}/semester/${entryId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting faculty from semester:', error);
      throw new Error('Failed to remove faculty from semester');
    }
  },

  async setDefaultCalendar(id) {
    try {
      const response = await axios.patch(`${baseURL}/${id}/set-default`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to set default calendar');
    }
  },
};

export default schoolCalendarService;
