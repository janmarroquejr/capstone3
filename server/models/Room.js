const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		isAvailable: {
			type: Boolean,
			default: true
		},
		image: {
			type: String
		}
	},

	{
		timestamps: true
	}
)

module.exports = mongoose.model('Room', RoomSchema)