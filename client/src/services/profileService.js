import axios from 'axios';

const baseURL = '/api/profile';

export const profileService = {
    // Fetch a profile by ID
    async getProfileByID(profileId) {
        try {
            const response = await axios.get(`${baseURL}/${profileId}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch profile by ID');
        }
    },

    // Fetch the currently logged-in user's profile
    async getMyProfile() {
        try {
            const response = await axios.get(`${baseURL}/me`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch your profile');
        }
    },

    // Update a profile by ID
    async updateProfile(profileId, profileData) {
        try {
            const response = await axios.put(`${baseURL}/${profileId}`, profileData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    },

    // Upload/replace a profile picture
    async uploadAvatar(profileId, file) {
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const response = await axios.post(`${baseURL}/${profileId}/avatar`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            return response.data;
        } catch (error) {
            throw new Error('Failed to upload profile picture');
        }
    }
};