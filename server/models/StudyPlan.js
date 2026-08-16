const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    startTime: {
      type: String, // format: "HH:mm" or ISO time
      required: true,
    },
    endTime: {
      type: String, // format: "HH:mm" or ISO time
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
  },
  { _id: false }
);

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: () => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
      },
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    studyBlocks: [blockSchema],
    breakBlocks: [blockSchema],
    slots: [
      {
        type: {
          type: String,
          enum: ['study', 'break'],
          required: true,
        },
        task: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Task',
        },
        title: String,
        startTime: String,
        endTime: String,
        duration: Number,
      },
    ],
    totalStudyTime: {
      type: Number, // in minutes
      default: 0,
    },
    totalBreakTime: {
      type: Number, // in minutes
      default: 0,
    },
    mood: {
      type: String,
      default: 'Neutral',
    },
    recommendations: [String],
  },
  {
    timestamps: true,
  }
);

studyPlanSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
