import API from './axios';

export const getLeaderboard = async (id) => {
  const response = await API.get(`/challenges/${id}/leaderboard`);
  return response.data;
};

export const getLeaderboardToday = async (id) => {
  const response = await API.get(`/challenges/${id}/leaderboard/today`);
  return response.data;
};

export const getLeaderboardArchive = async (id) => {
  const response = await API.get(`/challenges/${id}/leaderboard/archive`);
  return response.data;
};

export const getGlobalLeaderboard = async () => {
  const response = await API.get("/leaderboard/global");
  return response.data;
};

