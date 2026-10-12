/**
 * API service for Folio Notes
 * Proxied via Vite to http://localhost:5000/api
 */

const BASE_URL = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`Health check failed with status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching health:', err);
    return {
      status: 'error',
      message: 'Failed to connect to API',
      database: { connected: false, status: 'unreachable' },
    };
  }
}

export async function fetchNotes({ q = '', color = '', pinned = '' } = {}) {
  const params = new URLSearchParams();
  if (q && q.trim()) params.append('q', q.trim());
  if (color && color.trim()) params.append('color', color.trim());
  if (pinned !== '' && pinned !== null && pinned !== undefined) params.append('pinned', pinned);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE_URL}/notes${queryString}`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to fetch notes (${res.status})`);
  }
  return await res.json();
}

export async function fetchNoteById(id) {
  const res = await fetch(`${BASE_URL}/notes/${id}`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to fetch note ${id}`);
  }
  return await res.json();
}

export async function createNote(noteData) {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to create note (${res.status})`);
  }
  return await res.json();
}

export async function updateNote(id, noteData) {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to update note (${res.status})`);
  }
  return await res.json();
}

export async function deleteNote(id) {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to delete note (${res.status})`);
  }
  return await res.json();
}
