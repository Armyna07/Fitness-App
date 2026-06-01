const router = require("express").Router();
const { getGlobal } = require("../controllers/globalLeaderboard.controller");
const { protect } = require("../middleware/auth");

router.get("/global", protect, getGlobal);

module.exports = router;
