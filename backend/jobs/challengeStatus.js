const cron      = require('node-cron');
const Challenge = require('../models/Challenge');
const lbService = require('../services/leaderboard.service');
 
const runStatusTransitions = async () => {
  const now = new Date();
 
  // draft → active  (your model uses 'draft' not 'upcoming')
  await Challenge.updateMany(
    { status: 'draft', startDate: { $lte: now } },
    { $set: { status: 'active' } }
  );
 
  // active → completed
  const toComplete = await Challenge.find({
    status: 'active',
    endDate: { $lt: now },
  });
 
  for (const challenge of toComplete) {
    challenge.status = 'completed';
    await challenge.save();
    // Writes finalLeaderboard onto the Challenge document
    await lbService.archive(challenge._id);
    console.log(`Challenge ${challenge._id} completed and archived`);
  }
};
 
const startStatusJob = () => {
  cron.schedule('0 * * * *', async () => {
    try { await runStatusTransitions(); }
    catch (err) { console.error('Status job error:', err); }
  });
  runStatusTransitions().catch(console.error);
  console.log('Challenge status cron job started');
};
 
module.exports = { startStatusJob };
