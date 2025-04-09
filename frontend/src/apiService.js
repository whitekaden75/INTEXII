// src/apiService.js
const apiUrl = process.env.REACT_APP_API_URL;

export async function postData(endpoint, data) {
const token = localStorage.getItem('authToken');  // Retrieve token if needed

try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',  // Include token if present
    },
    body: JSON.stringify(data),
    });

    if (!response.ok) {
    throw new Error('Failed to post data');
    }

    return response;  // Return the response object directly
} catch (error) {
    console.error('Error posting data:', error);
    throw error;  // Rethrow error to be handled by the calling function
}
}
