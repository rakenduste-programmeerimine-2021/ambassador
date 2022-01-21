const express = require("express");
const router = express.Router();
const Chat = require("../../models/Chat");
const User = require("../../models/User");
const isLoggedIn = require("../../middleware/isLoggedIn");

// Get all chats
router.get("/", isLoggedIn, (req, res) => {
	Chat.find({ members: { $elemMatch: { user: req.user._id } } }, (err, chats) => {
		res.send(chats);
	}).sort({ lastUpdate: -1 });
});

// Get normal/default chats
router.get("/default", isLoggedIn, (req, res) => {
	Chat.find({ $where: "this.members.length === 2" }, (err, chats) => {
		res.send(chats);
	});
});

// Get single message by its id
router.get("/:id", isLoggedIn, (req, res) => {
	Chat.findById(req.params.id, (err, chat) => {
		if (err) res.send("Chat not found.");
		res.send(chat);
	});
});

// Create chat
router.post("/", isLoggedIn, async (req, res) => {
	let chatMembers = [];
	let membersList = req.body.members;

	try {
		for (const member of membersList) {
			await User.findOne({ username: member })
				.then((user) => {
					chatMembers.push({
						username: user.username,
						user: user._id,
					});
				})
				.catch((err) => console.log(err));
		}

		const newChat = new Chat({
			author: {
				id: req.user._id,
				username: req.user.username,
			},
			members: chatMembers,
			messages: [],
		});

		newChat.save();
		res.status(200).send(newChat);
	} catch (err) {
		res.status(500).send("Chat could not be created.");
	}
});

// Get the chats that fit the search with regex
router.get("/searching/:username", isLoggedIn, (req, res) => {
	if (req.params.username) {
		const regex = new RegExp(escapeRegex(req.params.username), "gi");
		Chat.find({ $and: [{ members: { $elemMatch: { username: regex } } }, { members: { $elemMatch: { username: req.user.username } } }] }, function (err, chats) {
			if (err) {
				console.log(err);
			} else {
				chats.forEach((chat) => {
					chat.members.forEach((member) => {
						if (member.user.id !== req.user.id) {
							chat.title = member.user.username;
						}
					});
				});
				res.send(chats);
			}
		});
	} else {
		chats.forEach((chat) => {
			chat.members.forEach((member) => {
				if (member.username !== req.user.username) {
					chat.title = member.username;
				}
			});
		});
		res.send(chats);
	}
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
