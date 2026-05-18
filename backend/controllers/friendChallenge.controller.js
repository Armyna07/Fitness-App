const fcService = require('../services/friendChallenge.service');
 
const send = async (req, res, next) => {
  try {
    const { challengeId, opponentIds } = req.body;
    const fc = await fcService.send(challengeId, req.user._id, opponentIds);
    res.status(201).json({ friendChallenge: fc });
  } catch (err) { next(err); }
};

const respond = async (req, res, next) => {
  try {
    const fc = await fcService.respond(req.params.id, req.user._id, req.body.status);
    res.json({ friendChallenge: fc });
  } catch (err) { next(err); }
};
 
const getMine = async (req, res, next) => {
  try {
    const fcs = await fcService.getMine(req.user._id);
    res.json({ friendChallenges: fcs });
  } catch (err) { next(err); }
};
 
const getOne = async (req, res, next) => {
  try {
    const fc = await fcService.getOne(req.params.id);
    res.json({ friendChallenge: fc });
  } catch (err) { next(err); }
};
 
module.exports = { send, respond, getMine, getOne };
