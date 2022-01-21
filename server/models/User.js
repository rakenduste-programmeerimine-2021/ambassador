//Require mongoose package
const mongoose = require("mongoose");
const passportMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	avatarColor: {
		type: String,
		required: false,
		default: "#000000",
	},
	address: {
		type: String,
		required: true,
	},
	contacts: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			username: String,
			nickname: String,
		},
	],
	//get the date of user creation
	created: {
		type: Date,
		default: Date.now(),
	},
});

//authenticate
userSchema.plugin(passportMongoose);

module.exports = mongoose.model("User", userSchema);
