const BASE_URL = 'http://localhost:5000/api';

export const apiRequest = async (path: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[AllCounter API Fallback] Failed for route ${path}:`, err);
    throw err;
  }
};
