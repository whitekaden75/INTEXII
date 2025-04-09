import React, { useState, useEffect } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;

export async function fetchSomething() {
  try {
    const res = await fetch(`${apiUrl}/endpoint`);
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: error.message };
  }
}

function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSomething()
      .then(response => {
        if (response.error) {
          setError(response.error);
        } else {
          setData(response);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>Data: {JSON.stringify(data)}</div>;
}

export default CredentialSafety;
