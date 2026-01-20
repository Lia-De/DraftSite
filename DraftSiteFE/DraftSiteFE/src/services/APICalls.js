import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// GET requests
export const getAll = async (endpoint) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        console.error('GET Error:', errorMessage);
        throw error;
    }
};

export const getById = async (endpoint, id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        console.error('GET Error:', errorMessage);
        throw error;
    }
};

// POST request (Create)
export const create = async (endpoint, data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        console.error('POST Error:', errorMessage);
        throw error;
    }
};

// PATCH request (Update)
export const update = async (endpoint, data) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/${endpoint}`, data);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        console.error('PATCH Error:', errorMessage);
        throw error;
    }
};

// DELETE request
export const deleteItem = async (endpoint, id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        console.error('DELETE Error:', errorMessage);
        throw error;
    }
};