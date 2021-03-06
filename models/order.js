const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderUser: { type: Schema.Types.ObjectId, ref: 'User' },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    method: String,
    quantity: Number,
    country: String,
    address: String,
    name: String
})

module.exports = mongoose.model('Order', orderSchema);