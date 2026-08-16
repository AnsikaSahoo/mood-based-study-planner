const mongoose = require('mongoose');

const PRIORITY_VALUES = ['High', 'Medium', 'Low'];
const DIFFICULTY_VALUES = ['Easy', 'Medium', 'Hard'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: PRIORITY_VALUES,
      default: 'Medium',
    },
    difficulty: {
      type: String,
      enum: DIFFICULTY_VALUES,
      default: 'Medium',
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    estimatedTime: {
      type: Number,
      required: [true, 'Estimated time is required'],
      min: 1,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ user: 1, completed: 1, deadline: 1 });

module.exports = mongoose.model('Task', taskSchema);
module.exports.PRIORITY_VALUES = PRIORITY_VALUES;
module.exports.DIFFICULTY_VALUES = DIFFICULTY_VALUES;
