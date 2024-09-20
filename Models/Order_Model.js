const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true},
    productId: [
        {
            productId: {
            type:String,
            },
        },
        {
            quantity: {
                type: Number,
                default:1,
            },
        },
    ],
    // after the product we can send the recept to the client
    amount: { type: Number, required: true },
    address: { type: Object, required: true }, // we  use obj type bec the stripe will send return an obj
    status:{type:String,default:"pending"}
},
    { timestamps: true },
)
module.exports = mongoose.model("Order",OrderSchema)