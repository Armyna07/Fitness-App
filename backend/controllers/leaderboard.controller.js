const lbService = require('../services/leaderboard.service');
 
const getCumulative = async (req, res, next) => {
  try {
    const rankings = await lbService.buildRankings(req.params.id);
    res.json({ rankings });
  } catch (err) { next(err); }
};
 
const getToday = async (req, res, next) => {
  try {
    const rankings = await lbService.getTodayRankings(req.params.id);
    res.json({ rankings });
  } catch (err) { next(err); }
};
 
const getArchive = async (req, res, next) => {
  try {
    const archive = await lbService.getArchive(req.params.id);
    res.json({ archive });
  } catch (err) { next(err); }
};
 
module.exports = { getCumulative, getToday, getArchive };
