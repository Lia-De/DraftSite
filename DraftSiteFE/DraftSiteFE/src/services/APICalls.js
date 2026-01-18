const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// GET requests
export const getAll = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error('GET Error:', error);
        throw error;
    }
};

export const getById = async (endpoint, id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch ${endpoint}/${id}`);
        return await response.json();
    } catch (error) {
        console.error('GET Error:', error);
        throw error;
    }
};

// POST request (Create)
export const create = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Failed to create ${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error('POST Error:', error);
        throw error;
    }
};

// PATCH request (Update)
export const update = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error('PUT Error:', error);
        throw error;
    }
};

// DELETE request
export const deleteItem = async (endpoint, id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Failed to delete ${endpoint}/${id}`);
        return await response.json();
    } catch (error) {
        console.error('DELETE Error:', error);
        throw error;
    }
};