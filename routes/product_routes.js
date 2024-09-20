const router = require("express").Router();
const product = require("../Models/Product_Model");
const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");

//create
router.post("/", verifyTokenAndAdmin, async (req, res) => {
	try {
		const newProduct = new product(req.body);
		const savedProduct = await newProduct.save();
		return res.status(200).json(savedProduct);
	} catch (error) {
		return res.status(500).json("server issues");
	}
});
//update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const updateProduct = await User.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);
		return res.status(200).json(updateProduct);
	} catch (error) {
		return res.status(500).json("server issues");
	}
});
//delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const productId = req.params.id;
		if (!productId) return res.status(404).json("invalid id");
		const deletedProduct = await User.findByIdAndDelete(productId);
		return res.status(200).json(deletedProduct + "has been deleted");
	} catch (error) {
		return res.status(500).json("server issues");
	}
});
// get single product by id
router.get("/find:id", async (req, res) => {
	try {
		const productId = req.params.id;
		if (!productId) return res.status(400).json("invalid Id");
		const product = await product.findById(productId);
		return res.status(200).json(product + "successfully fetched");
	} catch (error) {
		return res.status(500).json("server error");
	}
});
//get all products either by categories or createdAt
router.get("/", async (req, res) => {
	try {
		// fetching by either createdAt or by category
		const qNew = req.query.new;
		const qCategory = req.query.category;
		let products;
		if (qNew) {
			product = await product.find().sort({ createdAt: -1 }).limit(5); // first 5
		} else if (qCategory) {
			products = await product.find({
				categories: { $in: [qCategory] },
			});
		} else {
			products = await product.find();
		}
		return res.status(200).json(products);
	} catch (error) {
		return res.status(500).json("server error");
	}
});
module.exports = router;
