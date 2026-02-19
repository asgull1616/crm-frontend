import api from "../axios";

/* ---------------- Programs ---------------- */
export function getPrograms() {
  return api.get(`/programs`);
}

export function createProgram(data) {
  return api.post(`/programs`, data);
}

export function updateProgram(programId, data) {
  return api.patch(`/programs/${programId}`, data);
}

export function deleteProgram(programId) {
  return api.delete(`/programs/${programId}`);
}

/* ---------------- Columns ---------------- */
export function createColumn(programId, data) {
  return api.post(`/programs/${programId}/columns`, data);
}

export function updateColumn(columnId, data) {
  return api.patch(`/programs/columns/${columnId}`, data);
}

export function deleteColumn(columnId) {
  return api.delete(`/programs/columns/${columnId}`);
}

export function moveColumn(columnId, newOrder) {
  return api.patch(`/programs/columns/${columnId}/move`, { newOrder });
}

/* ---------------- Cards ---------------- */
export function createCard(columnId, data) {
  return api.post(`/programs/columns/${columnId}/cards`, data);
}

export function updateCard(cardId, data) {
  return api.patch(`/programs/cards/${cardId}`, data);
}

export function deleteCard(cardId) {
  return api.delete(`/programs/cards/${cardId}`);
}

export function moveCard(cardId, toColumnId, newOrder) {
  return api.patch(`/programs/cards/${cardId}/move`, { toColumnId, newOrder });
}

export function getUsers() {
  return api.get(`/api/users`);
}
