const mongoose = require("mongoose");
const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const { status, priority, q, sort = "-createdAt" } = req.query;
    const query = { user: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (q) query.title = { $regex: q, $options: "i" };

    const tasks = await Task.find(query).sort(sort);

    return res.json({ data: { tasks } });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null
    });

    return res.status(201).json({
      message: "Task created",
      data: { task }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create task" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ data: { task } });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatableFields = ["title", "description", "status", "priority", "dueDate"];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    return res.json({
      message: "Task updated",
      data: { task }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const deleted = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Task deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete task" });
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
};
