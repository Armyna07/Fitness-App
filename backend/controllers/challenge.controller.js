const challengeService = require('../services/challenge.service');

 
const create = async (req, res, next) => {
  try {
    const result = await challengeService.create(req.body, req.user._id);
    res.status(201).json(result);
  } catch (err) { next(err); }
};
 
const getAllPublic = async (req, res, next) => {
  try {
    const challenges = await challengeService.getAllPublic(req.query);
    res.json({ challenges });
  } catch (err) { next(err); }
};
 
const getMine = async (req, res, next) => {
  try {
    const challenges = await challengeService.getMine(req.user._id);
    res.json({ challenges });
  } catch (err) { next(err); }
};
 
const getOne = async (req, res, next) => {
  try {
    const result = await challengeService.getOne(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
};
 
const edit = async (req, res, next) => {
  try {
    const challenge = await challengeService.edit(req.params.id, req.body, req.user._id);
    res.json({ challenge });
  } catch (err) { next(err); }
};
 
const remove = async (req, res, next) => {
  try {
    await challengeService.remove(req.params.id, req.user._id);
    res.json({ message: 'Challenge deleted' });
  } catch (err) { next(err); }
};
 
const joinById = async (req, res, next) => {
  try {
    const challenge = await challengeService.joinById(req.params.id, req.user._id);
    res.status(201).json({ challenge, message: "Challenge joined" });
  } catch (err) { next(err); }
};
 
const joinByCode = async (req, res, next) => {
  try {
    const challenge = await challengeService.joinByCode(req.params.code, req.user._id);
    res.status(201).json({ challenge, message: "Challenge joined" });
  } catch (err) { next(err); }
};
 
const leave = async (req, res, next) => {
  try {
    await challengeService.leave(req.params.id, req.user._id);
    res.json({ message: 'Left challenge' });
  } catch (err) { next(err); }
};
 
module.exports = { create, getAllPublic, getMine, getOne, edit, remove, joinById, joinByCode, leave };
