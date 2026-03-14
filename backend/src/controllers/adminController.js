const User = require("../models/User");
const Task = require("../models/Task");

const getUsers = async (_req, res) => {
  try {
    const users = await User.find().sort("-createdAt").select("-password");
    return res.json({ data: { users } });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

const getStats = async (_req, res) => {
  try {
    const [users, tasks, doneTasks] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ status: "done" })
    ]);

    return res.json({
      data: {
        users,
        tasks,
        doneTasks,
        pendingTasks: tasks - doneTasks
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch stats" });
  }
};

const toggleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.json({
      message: "User status updated",
      data: { user: user.toJSON() }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user" });
  }
};

module.exports = {
  getUsers,
  getStats,
  toggleUser
};
