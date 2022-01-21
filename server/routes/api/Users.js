const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../../models/User");
const Chat = require("../../models/Chat");
const isLoggedIn = require("../../middleware/isLoggedIn");

// Get users
router.get("/", isLoggedIn, (req, res) => {
	User.find({}, (err, users) => {
		res.send(users);
	});
});

// Get current user
router.get("/current-user", isLoggedIn, (req, res) => {
	res.send(req.user);
});

// Get single user by its id
router.get("/:id", isLoggedIn, (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) {
			res.send("User not found.");
		} else {
			res.send(user);
		}
	});
});

// Register new user
router.post("/register", async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(req.body.password, salt);
	try {
		const newUser = new User({
			username: req.body.username,
			name: req.body.name,
			email: req.body.email,
			address: req.body.address,
			password: hash,
		});

		newUser.save();
		res.status(200).send("Welcome to the club!");
	} catch (err) {
		res.status(500).send("Error registering new user please try again.");
	}
});

//Handle login
router.post("/login", (req, res, next) => {
	let password = req.body.password;
	let email = req.body.email;

	if (password && email) {
		User.findOne({ email: email }, function (err, foundUser) {
			if (!foundUser) {
				res.json({
					success: false,
					message: "Incorrect credentials 1",
				});
			} else {
				bcrypt.compare(password, foundUser.password, (err, password) => {
					if (password) {
						passport.authenticate("local")(req, res, function () {
							if (err) {
								console.log(err);
							} else {
								res.json({
									foundUser: req.user,
								});
							}
						});
					} else {
						res.json({
							success: false,
							message: "Incorrect credentials 2",
						});
					}
				});
			}
		});
	} else {
		res.json({
			success: false,
			message: "Authentication failed! Please check the request",
		});
	}
});

// Logout
router.get("/logout", (req, res) => {
	req.logout();
});

// Get single user by username
router.get("/new-contact/:username", isLoggedIn, (req, res) => {
	User.findById(req.user._id)
		.then((user) => {
			User.findOne({ username: req.params.username })
				.then((contact) => {
					if (req.user.id == contact.id) {
						return;
					}
					if (user.contacts.filter((contacts) => contacts.user.toString() === contact.id).length > 0) {
						return;
					}
					user.contacts.unshift({ user: contact.id, username: contact.username, nickname: "" });
					user.save();
					contact.contacts.unshift({ user: req.user.id, username: req.user.username, nickname: "" });
					contact.save().then((user) => {
						res.send(user);
					});
				})
				.catch((err) => res.send(err));
		})
		.then((data) => {
			return data;
		})
		.catch((err) => res.send(err));
});

// Update users contact
router.post("/update-contact/:username", isLoggedIn, (req, res) => {
	const nickname = req.body.nickname;

	User.updateOne(
		{ _id: req.user._id, contacts: { $elemMatch: { username: req.params.username } } },
		{
			$set: {
				"contacts.$.nickname": nickname,
			},
		},
		{ new: true },
		(err, user) => {
			if (err) {
				res.send("Could not update this contact.");
			}
		}
	).then((response) => {
		res.send(response);
	});
});

// Get the users that fit the search with regex
router.get("/searching/:username", isLoggedIn, (req, res) => {
	if (req.params.username) {
		const regex = new RegExp(escapeRegex(req.params.username), "gi");
		User.find({ $or: [{ username: regex }] }, function (err, response) {
			if (err) {
				console.log(err);
			} else {
				res.send(response);
			}
		});
	}
});

// Update users settings
router.post("/update-user", isLoggedIn, async (req, res) => {
	User.findOneAndUpdate(
		{ _id: req.user._id },
		{
			$set: {
				name: req.body.name,
				email: req.body.email,
				address: req.body.address,
				avatarColor: req.body.avatarColor,
			},
		},
		{ new: true },
		(err, user) => {
			if (err) {
				res.send("Could not update this user.");
			}
		}
	).then((response) => {
		res.send(response);
	});
});

// Remove user from contact list
router.get("/remove-contact/:username", isLoggedIn, (req, res) => {
	Chat.findOneAndRemove(
		{
			members: {
				$elemMatch: { username: req.user.username },
				$elemMatch: { username: req.params.username },
			},
		},
		(err, chat) => {
			if (err) {
				res.send("Could not remove this chat.");
			}
		}
	).then(() => {
		User.updateOne(
			{ _id: req.user._id },
			{
				$pull: {
					contacts: {
						username: req.params.username,
					},
				},
			},
			{ multi: true },
			(err, user) => {
				if (err) {
					res.send("Could not remove this contact.");
				}
			}
		).then(() => {
			User.updateOne(
				{ username: req.params.username },
				{
					$pull: {
						contacts: {
							user: req.user._id,
						},
					},
				},
				{ multi: true },
				(err, user) => {
					if (err) {
						res.send("Could not remove user from this user's contacts.");
					}
				}
			).then((response) => {
				res.send(response);
			});
		});
	});
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
