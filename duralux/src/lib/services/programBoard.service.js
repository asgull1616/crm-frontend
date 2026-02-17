import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3050";

function authHeader(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

/* ---------------- Programs ---------------- */
export function getPrograms(token) {
    return axios.get(`${API_BASE}/programs`, authHeader(token));
}

export function createProgram(data, token) {
    // data: { name, description? }
    return axios.post(`${API_BASE}/programs`, data, authHeader(token));
}

export function updateProgram(programId, data, token) {
    // data: { name?, description? }
    return axios.patch(`${API_BASE}/programs/${programId}`, data, authHeader(token));
}

export function deleteProgram(programId, token) {
    return axios.delete(`${API_BASE}/programs/${programId}`, authHeader(token));
}

/* ---------------- Columns ---------------- */
export function createColumn(programId, data, token) {
    return axios.post(`${API_BASE}/programs/${programId}/columns`, data, authHeader(token));
}


export function updateColumn(columnId, data, token) {
    // data: { name }
    return axios.patch(`${API_BASE}/programs/columns/${columnId}`, data, authHeader(token));
}

export function deleteColumn(columnId, token) {
    return axios.delete(`${API_BASE}/programs/columns/${columnId}`, authHeader(token));
}

export function moveColumn(columnId, newOrder, token) {
    return axios.patch(
        `${API_BASE}/programs/columns/${columnId}/move`,
        { newOrder },
        authHeader(token)
    );
}

/* ---------------- Cards ---------------- */
export function createCard(columnId, data, token) {
    // data: { title }  (assignee şimdilik UI’da yazı olarak var, backend userId istediği için şimdilik göndermiyoruz)
    return axios.post(`${API_BASE}/programs/columns/${columnId}/cards`, data, authHeader(token));
}

export function updateCard(cardId, data, token) {
    return axios.patch(`${API_BASE}/programs/cards/${cardId}`, data, authHeader(token));
}

export function getUsers(token) {
    return axios.get(`${API_BASE}/api/users`, authHeader(token));
}



export function deleteCard(cardId, token) {
    return axios.delete(`${API_BASE}/programs/cards/${cardId}`, authHeader(token));
}

export function moveCard(cardId, toColumnId, newOrder, token) {
    return axios.patch(
        `${API_BASE}/programs/cards/${cardId}/move`,
        { toColumnId, newOrder },
        authHeader(token)
    );
}
