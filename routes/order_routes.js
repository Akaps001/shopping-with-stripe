const router = require("express").Router();
const Order = require("../Models/Order_Model");
const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");

//create
router.post("/", verifyToken, async (req, res) => {
	try {
		const newOrder = new Order(req.body);
		const savedOrder = await newOrder.save();
		return res.status(200).json(savedOrder);
	} catch (error) {
		return res.status(500).json("server issues");
	}
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const updateOrder = await Order.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);
		return res.status(200).json(updateOrder);
	} catch (error) {
		return res.status(500).json("server issues");
	}
});
//get user order
router.get(
	"/find:userId",
	verifyTokenAndAuthorization,
	async (req, res) => {
		try {
			const orderId = req.params.userId;
			if (!orderId) return res.status(400).json("invalid Id");
			const order = await order.find(orderId);
			return res.status(200).json(order + "successfully fetched");
		} catch (error) {
			return res.status(500).json("server error");
		}
	}
);
//get all order
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	try {
		const orders = await Order.find();
		return res.status(200).json(orders);
	} catch (error) {
		return res.status(500).json("server error");
	}
});
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const orderId = req.params.id;
		if (!orderId) return res.status(404).json("invalid id");
		const deleteOrder = await User.findByIdAndDelete(orderId);
		return res.status(200).json(deleteOrder + "has been deleted");
	} catch (error) {
		return res.status(500).json("server issues");
	}
});
// GET MONTLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
	try {
		const date = new Date();
		const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
		const previousMonth = new Date(
			new Date().setMonth(lastMonth.getMonth() - 1)
		);
		const income = await Order.aggregate([
			{ $match: { createdAt: { $gte: previousMonth } } },
			{
				$project: {
					month: { $month: "createdAt" },
					sales: "$amount",
				},

				$group: {
					_id: "$month",
					total: { $sum: "$sales" },
				},
			},
		]);
		return res.status(200).json(income);
	} catch (error) {
		return res.status(500).json("server issues");
	}
});

module.exports = router;
