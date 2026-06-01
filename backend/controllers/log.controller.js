const logService = require('../services/log.service');
 
const submit = async (req, res, next) => {
  try {
    const result = await logService.submit(req.params.id, req.user._id, req.body.value);
    res.status(201).json(result);
  } catch (err) { next(err); }
};
 
// FIX #18: was logService.getForChallenge — method does not exist; correct name is getAllLogs
const getForChallenge = async (req, res, next) => {
  try {
    const logs = await logService.getAllLogs(req.params.id);
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
