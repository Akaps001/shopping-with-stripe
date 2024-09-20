// creating express application
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user_routes");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product_routes");
const cartRoute = require("./routes/cart_routes");
const orderRoute = require("./routes/order_routes");

dotenv.config();
const app = express();
app.use(express.json()); // for reading in json format
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(process.env.PORT || 5000, async () => {
	try {
		console.log("Backend server running on");
		await mongoose.connect("mongodb://localhost:27017/shopping_Api");
		console.log("DB connected successfully");
	} catch (error) {
		console.log(error);
	}
});
