const express = require("express");
const {
  getUsers,
  getStats,
  toggleUser
} = require("../../controllers/adminController");
const { auth, requireAdmin } = require("../../middleware/auth");

const router = express.Router();

router.use(auth, requireAdmin);
router.get("/users", getUsers);
router.get("/stats", getStats);
router.patch("/users/:id/toggle", toggleUser);

module.exports = router;
