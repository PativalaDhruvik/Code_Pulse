const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'
);
const BASE_URL = import.meta.env.VITE_API_URL || (isLocal ? `http://${window.location.hostname}:8000/api` : '/api');

function getHeaders() {
  const savedUser = sessionStorage.getItem('codepulse_user');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user && user.token) {
        headers['Authorization'] = `Token ${user.token}`;
      }
    } catch (e) {
      console.error("Error parsing user token from session storage:", e);
    }
  }
  return headers;
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Invalid credentials");
  }
  return res.json(); // returns { name, email, token }
}

export async function register(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Please fill in all fields");
  }
  return res.json(); // returns { name, email, token }
}

export async function getErrors() {
  const res = await fetch(`${BASE_URL}/error-library/`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    throw new Error("Failed to fetch error library");
  }
  return res.json();
}

export async function getSubmissions() {
  const res = await fetch(`${BASE_URL}/submissions/`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    throw new Error("Failed to fetch submissions");
  }
  return res.json();
}

export async function saveSubmission(submission) {
  const res = await fetch(`${BASE_URL}/submissions/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(submission)
  });
  if (!res.ok) {
    throw new Error("Failed to save submission");
  }
  return res.json();
}

export async function analyzeCode(code) {
  const res = await fetch(`${BASE_URL}/analyze/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ code })
  });
  if (!res.ok) {
    throw new Error("Failed to analyze code");
  }
  return res.json();
}

export async function getPuzzles() {
  const res = await fetch(`${BASE_URL}/puzzles/`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    throw new Error("Failed to fetch puzzles");
  }
  return res.json();
}
