const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema(
  {
    roomId: {
      type: String,
      required: true
    },
    userId: {
    	type: String,
    	required: true
    },
    startDate: {
    	type: String,
    	required: true
    },
    endDate: {
    	type: String,
    	required: true
    },
    isActive: {
    	type: Boolean,
    	default: true
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", BookingSchema);