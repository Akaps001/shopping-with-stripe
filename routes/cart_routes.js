const router = require("express").Router();
const Cart = require("../Models/Cart_Model");
const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");

//create
router.post("/", verifyToken, async (req, res) => {
	try {
		const newCart = new Cart(req.body);
		const savedCart = await newCart.save();
		return res.status(200).json(savedCart);
	} catch (error) {
		return res.status(500).json("server issues");
	}
});

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
	try {
		const updateCart = await Cart.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);
		return res.status(200).json(updateCart);
	} catch (error) {
		return res.status(500).json("server issues");
	}
});

//get user cart
router.get(
	"/find/:userId",
	verifyTokenAndAuthorization,
	async (req, res) => {
		try {
			const userId = req.params.id;
			if (!userId) return res.status(400).json("invalid Id");
			const cart = await product.find(userId);
			return res.status(200).json(cart + "successfully fetched");
		} catch (error) {
			return res.status(500).json("server error");
		}
	}
);
//get all carts
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	try {
		const carts = await Cart.find();
		return res.status(200).json(carts);
	} catch (error) {
		return res.status(500).json("server error");
	}
});
router.delete(
	"/:id",
	verifyTokenAndAuthorization,
	async (req, res) => {
		try {
			const cartId = req.params.id;
			if (!cartId) return res.status(404).json("invalid id");
			const deletedCart = await User.findByIdAndDelete(cartId);
			return res.status(200).json(deletedCart + "has been deleted");
		} catch (error) {
			return res.status(500).json("server issues");
		}
	}
);
module.exports = router;
