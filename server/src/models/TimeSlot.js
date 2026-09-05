const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// A doctor cannot have the same time slot twice on the same date
timeSlotSchema.index(
  {
    doctorId: 1,
    date: 1,
    time: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("TimeSlot", timeSlotSchema);