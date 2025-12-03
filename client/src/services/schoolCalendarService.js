import axios from 'axios';

const baseURL = '/api/school-calendar';

// Converts "" → null (MariaDB-friendly)
function normalizeDates(data) {
  const cleaned = {};
  for (const key in data) {
    cleaned[key] = data[key] === '' ? null : data[key];
  }
  return cleaned;
}

const schoolCalendarService = {
  // School Calendar CRUD

  async getAllCalendars() {
    try {
      const response = await axios.get(baseURL);
      return response.data;
    } catch (error) {
      throw new Error('Failed to load school calendars');
    }
  },

  async getCalendarById(id) {
    //console.log('📌 getCalendarById CALLED with id:', id);

    try {
      const url = `${baseURL}/${id}`;
      console.log('🌐 Requesting URL:', url);

      const response = await axios.get(url);

      //console.log('✅ Response Status:', response.status);
      //console.log('📦 Response Data:', response.data);

      return response.data;
    } catch (error) {
      console.log('❌ ERROR in getCalendarById:');

      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      } else if (error.request) {
        console.log('🚫 No response received:', error.request);
      } else {
        console.log('⚠️ Error setting up request:', error.message);
      }

      throw new Error('Failed to load calendar');
    }
  },

  async addCalendar(calendarData) {
    console.log('Adding calendar with data:', calendarData);
    try {
      const response = await axios.post(baseURL, calendarData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to add calendar');
    }
  },

  // FIXED VERSION WITH DATE NORMALIZATION
  async editCalendar(id, data) {
    //console.log('📌 editCalendar CALLED');
    //console.log('ID:', id);
    //console.log('Payload BEFORE normalize:', data);

    const cleaned = normalizeDates(data);

    //console.log('🧽 Payload AFTER normalize:', cleaned);
    try {
      const url = `${baseURL}/${id}`;
      console.log('🌐 PUT URL:', url);

      const response = await axios.put(url, cleaned);
      //console.log('✅ PUT Response:', response.data);

      return response.data;
    } catch (error) {
      console.log('❌ ERROR in editCalendar:');

      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      }
      throw new Error('Failed to edit calendar');
    }
  },

  async deleteCalendar(id) {
    try {
      const response = await axios.delete(`${baseURL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete calendar');
    }
  },

  // No School CRUD
  async getNoSchoolDays(calendarId) {
    try {
      const response = await axios.get(`${baseURL}/${calendarId}/no-school`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to load no school days');
    }
  },

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

  async deleteNoSchoolDay(entryId) {
    try {
      const response = await axios.delete(`${baseURL}/no-school/${entryId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting faculty from semester:', error);
      throw new Error('Failed to remove faculty from semester');
    }
  },

  // Faculty-Semester CRUD
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

  async deleteFacultyFromSemester(entryId) {
    try {
      const response = await axios.delete(`${baseURL}/semester/${entryId}`);
      return response.data;
    } catch (error) {
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
