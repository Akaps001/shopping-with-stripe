const router = require("express").Router();
const User = require("../Models/user_Models");
const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
	//check password bec user can change password
	if (req.body.password) {
		req.body.password = CryptoJS.AES.encrypt(
			req.body.password,
			process.env.PASS_SEC
		).toString();
	}
	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body }, // take everything inside req.body and set it again
			{ new: true }
		);
		return res.status(200).json(updatedUser);
	} catch (error) {
		return res.status(500).json(error);
	}
});
// delete
router.delete(
	"/:id",
	verifyTokenAndAuthorization,
	async (req, res) => {
		try {
			const deleteUser = await User.findByIdAndDelete(req.params.id);
			if (!deleteUser) {
				return res.status("Id not found or incorrect ID");
			}

			return res
				.status(200)
				.json("This user has been deleted:" + deleteUser);
		} catch (error) {
			return res.status(500).json("server issues");
		}
	}
);
//getting user by id by the admin only
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const getUser = await User.findById(req.params.id);
		if (!getUser)
			return res.status("User does not exit or incorrect id");
		return res.status(200).json(getUser);
	} catch (error) {
		return res.status(500).json("server issues");
	}
});
// get all user by admin only
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	//quering the search
	const query = req.query.new;
	try {
		const getAllUsers = query
			? await User.find().sort({ _id: -1 }).limit(1)
			: await User.find(); // if there is a query return 5 users if there is no query return all users
		return res.status(200).json(getAllUsers);
	} catch (error) {
		return res.status(500).json("server issues");
	}
});
//get user stats to give us total number of users per months
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
	const date = new Date(); // create current date
	//finding last year
	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
	try {
		// getting stats per month and grouping  with mongodb aggregate
		const data = await User.aggregate([
			{ $match: { createdAt: { $gte: lastYear } } },
			{
				$project: {
					month: { $month: "$createdAt" },
				},
			},
			{
				$group: {
					_id: "$month", //unique id
					total: { $sum: 1 }, // total user number
				},
			},
		]);
		return res.status(200).json(data);
	} catch (error) {
		return res.status(500).json("server issues");
	}
});
module.exports = router;
