const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task: {               // ✅ changed from text -> task
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);