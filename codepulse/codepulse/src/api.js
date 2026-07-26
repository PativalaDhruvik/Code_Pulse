// CodePulse Studio - Real REST API Module
const BASE_URL = 'http://127.0.0.1:8000/api';

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

async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    sessionStorage.removeItem('codepulse_user');
    window.dispatchEvent(new Event('auth_unauthorized'));
  }
  return res;
}

export async function login(email, password) {
  const res = await apiFetch(`${BASE_URL}/auth/login/`, {
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
  const res = await apiFetch(`${BASE_URL}/auth/register/`, {
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
  const res = await apiFetch(`${BASE_URL}/error-library/`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    throw new Error("Failed to fetch error library");
  }
  return res.json();
}

export async function getSubmissions() {
  const res = await apiFetch(`${BASE_URL}/submissions/`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    throw new Error("Failed to fetch submissions");
  }
  return res.json();
}

export async function saveSubmission(submission) {
  const res = await apiFetch(`${BASE_URL}/submissions/`, {
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
  const res = await apiFetch(`${BASE_URL}/analyze/`, {
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
  const res = await apiFetch(`${BASE_URL}/puzzles/`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    throw new Error("Failed to fetch puzzles");
  }
  return res.json();
}
