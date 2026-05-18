const logService = require('../services/log.service');
 
const submit = async (req, res, next) => {
  try {
    const result = await logService.submit(req.params.id, req.user._id, req.body.value);
    res.status(201).json(result);
  } catch (err) { next(err); }
};
 
const getForChallenge = async (req, res, next) => {
  try {
    const logs = await logService.getForChallenge(req.params.id);
    res.json({ logs });
  } catch (err) { next(err); }
};
 
const getMyLogs = async (req, res, next) => {
  try {
    const logs = await logService.getMyLogs(req.params.id, req.user._id);
    res.json({ logs });
  } catch (err) { next(err); }
};
 
module.exports = { submit, getForChallenge, getMyLogs };
