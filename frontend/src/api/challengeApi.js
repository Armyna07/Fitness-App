import API from './axios';

export const getChallenges = async () => {
  const res = await API.get('/challenges');
  return res.data;
};

export const getMyChallenges = async () => {
  const res = await API.get('/challenges/mine');
  return res.data.challenges;
};

export const getChallengeById = async (id) => {
  const res = await API.get(`/challenges/${id}`);
  return res.data;
};

export const createChallenge = async (data) => {
  const res = await API.post('/challenges', data);
  return res.data;
};

export const joinChallenge = async (id) => {
  const res = await API.post(`/challenges/${id}/join`);
  return res.data;
};

export const leaveChallenge = async (id) => {
  const res = await API.delete(`/challenges/${id}/leave`);
  return res.data;
};

export const deleteChallenge = async (id) => {
  const res = await API.delete(`/challenges/${id}`);
  return res.data;
};

export const submitLog = async (challengeId, value) => {
  const res = await API.post(`/challenges/${challengeId}/logs`, { value });
  return res.data;
};

export const getMyLogs = async (challengeId) => {
  const res = await API.get(`/challenges/${challengeId}/logs/me`);
  return res.data.logs;
};

export const getFriendChallenges = async () => {
  const res = await API.get('/friend-challenges/mine');
  return res.data.friendChallenges;
};

export const getLeaderboard = async (challengeId) => {
  const res = await API.get(`/challenges/${challengeId}/leaderboard`);
  return res.data;
};

export const sendFriendChallenge = async (challengeId, opponentIds) => {
  const res = await API.post('/friend-challenges', { challengeId, opponentIds });
  return res.data.friendChallenge;
};

export const respondFriendChallenge = async (id, status) => {
  const res = await API.post(`/friend-challenges/${id}/respond`, { status });
  return res.data.friendChallenge;
};
