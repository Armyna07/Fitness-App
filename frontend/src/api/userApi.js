import API from './axios';
 
export const getMe = async () => {
  const res = await API.get('/users/me');
  return res.data;
};
 
// FIX #15: added missing functions
export const getUserProfile = async (id) => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};
 
export const getFriends = async () => {
  const res = await API.get('/users/me/friends');
  return res.data.friends;   // array of User objects
};
 
export const addFriend = async (friendId) => {
  const res = await API.post(`/users/me/friends/${friendId}`);
  return res.data;
};
 
export const removeFriend = async (friendId) => {
  const res = await API.delete(`/users/me/friends/${friendId}`);
  return res.data;
};
 
// search users by username / displayName (hits GET /api/users/search?q=...)
export const searchUsers = async (query) => {
  const res = await API.get('/users/search', { params: { q: query } });
  return res.data.users;
};
 
export const getMyHistory = async () => {
  const res = await API.get('/users/me/history');
  return res.data.history;
};
