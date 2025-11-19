import axios from 'axios';

const baseURL = '/api/events';

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const eventService = {
  async getAllEvents() {
    const res = await axios.get(baseURL);
    return res.data;
  },

  async getEventById(id) {
    const res = await axios.get(`${baseURL}/${id}`);
    return res.data;
  },

  async createEvent(formData) {
    const res = await axios.post(baseURL, formData, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async editEvent(id, formData) {
    const res = await axios.put(`${baseURL}/${id}`, formData, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async deleteEvent(id) {
    const res = await axios.delete(`${baseURL}/${id}`, {
      headers: authHeader(),
    });
    return res.data;
  },
};

export default eventService;
