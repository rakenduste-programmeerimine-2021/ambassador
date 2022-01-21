//Require mongoose package
var mongoose = require("mongoose");

//define schema of chats
var chatSchema = new mongoose.Schema({
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		username: String,
	},
	members: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			username: String,
		},
	],
	messages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
	],
	lastUpdate: Date,
	created: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("Chat", chatSchema);
