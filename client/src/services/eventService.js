import axios from 'axios';

const baseURL = '/api/events';

const eventService = {
  // Fetch all Events
  async getAllEvents() {
    try {
      const response = await axios.get(baseURL);
      return response.data;
    } catch (error) {
      console.error('Error loading events:', error);
      throw new Error('Failed to load events data');
    }
  },

  // Add a new Event
  async addEvent(eventData) {
    console.log('eventData:', eventData);
    try {
      const response = await axios.post(baseURL, eventData);
      return response.data;
    } catch (error) {
      console.error('Error adding event:', error);
      throw new Error('Failed to add event');
    }
  },

  // Delete an Event by ID
  async deleteEvent(eventId) {
    try {
      const response = await axios.delete(`${baseURL}/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  },
};

// Grabbing events by admin ID
eventService.getEventsByAdminId = async function (adminId) {
  try {
    const response = await axios.get(`${baseURL}/admin/${adminId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting events by admin ID:', error);
    throw new Error('Failed to get events by admin ID');
  }
};

export default eventService;
