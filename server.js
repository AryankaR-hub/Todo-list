const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE SCHEMA ---
const itemSchema = new mongoose.Schema({
    content: { type: String, required: true },
    type: { type: String, enum: ['task', 'note', 'focus'], default: 'task' },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date, default: null } 
});
const Item = mongoose.model('Item', itemSchema);

// --- DB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// --- API ROUTES ---

// Get items by type
app.get("/items/:type", async (req, res) => {
    try {
        const items = await Item.find({ type: req.params.type });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new task with date
app.post("/tasks", async (req, res) => {
    try {
        const { task, dueDate } = req.body;
        if (!task) return res.status(400).json({ message: "Task required" });
        
        const newItem = new Item({ 
            content: task.trim(), 
            type: 'task',
            dueDate: dueDate || null 
        });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Notes or Focus (Upsert)
app.patch("/special/update", async (req, res) => {
    try {
        const { type, content } = req.body;
        const updatedItem = await Item.findOneAndUpdate(
            { type: type }, 
            { content: content }, 
            { upsert: true, new: true }
        );
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark Task Complete
app.put("/tasks/:id", async (req, res) => {
    try {
        await Item.findByIdAndUpdate(req.params.id, { completed: true });
        res.json({ message: "Completed" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete Task
app.delete("/tasks/:id", async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));