const apiUrl = process.env.REACT_APP_API_URL;

export async function fetchSomething() {
  const res = await fetch(`${apiUrl}/endpoint`);
  return res.json();
}
