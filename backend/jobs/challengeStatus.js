const cron      = require('node-cron');
const Challenge = require('../models/Challenge');
const lbService = require('../services/leaderboard.service');

const runStatusTransitions = async () => {
  const now = new Date();

  // draft/upcoming → active
  const activated = await Challenge.updateMany(
    { status: { $in: ['draft', 'upcoming'] }, startDate: { $lte: now } },
    { $set: { status: 'active' } }
  );
  if (activated.modifiedCount > 0) {
    console.log(`Activated ${activated.modifiedCount} challenge(s)`);
  }

  // active → completed
  const toComplete = await Challenge.find({
    status: 'active',
    endDate: { $lt: now },
  });

  for (const challenge of toComplete) {
    challenge.status = 'completed';
    await challenge.save();
    await lbService.archive(challenge._id);
    console.log(`Challenge ${challenge._id} completed and archived`);
  }
};

const startStatusJob = () => {
  // Runs at the top of every hour
  cron.schedule('0 * * * *', async () => {
    try { await runStatusTransitions(); }
    catch (err) { console.error('Status job error:', err); }
  });

  // Also run immediately on startup so nothing is stale after a server restart
  runStatusTransitions().catch(console.error);
  console.log('Challenge status cron job started');
};

module.exports = { startStatusJob };