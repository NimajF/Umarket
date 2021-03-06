const passport = require('passport');
const User = require('../models/users');
const Cart = require('../models/cart');
const Product = require('../models/products');
const Order = require('../models/order');
const Notification = require('../models/notifications')

const Day = require('../public/javascripts/weekday');

module.exports.renderPurchase = async (req, res) => {
    const { price, qty }  = req.query.product;
    console.log(req.query)
    const product = await Product.findById(req.params.productId).populate('author');
    const date = Day();
    // const method = shippingMethod() 
    res.render('users/purchase', { product, date, price, qty })
}

module.exports.purchaseProduct = async (req, res) => {
    const { id, userId, qty } = req.body.product;
   
    const { name, country, address } = req.body.user;
    const { method, } = req.body.shipping;
    
    const foundProduct = await Product.findById(id);
    const productAuthor = await User.findById(userId);

    const order = new Order({
        orderUser: req.user._id,
        product: foundProduct,
        method: method,
        quantity: qty,
        country: country,
        address: address,
        name: name
    })
    const notification = new Notification({
        title: `${order.orderUser} bought your product!`,
        product: foundProduct
    })

    productAuthor.reputation += 100;
    productAuthor.totalSoldProducts += 1;
    productAuthor.notifications.push(notification);
    console.log(qty)
    foundProduct.stock -= qty;
    await order.save();
    await productAuthor.save(); //When the user buys a product, the autor of the product gets +100 of reputation
    await foundProduct.save() // When the user buys a product, the product stock is subtracted by the selected quantity
    console.log(productAuthor.reputation)
    console.log(order.quantity)
    res.redirect(`/order/purchased/${order._id}`)
    
    
}

module.exports.orderSuccess = async (req, res) => {
    const { orderId } = req.params;
    const date = Day();
    const foundOrder = await Order.findById(orderId).populate('product');
    if (req.user.equals(foundOrder.orderUser)){ // If the current logged user ID is equals to the user ID that made the order, get the response
        res.render('users/purchasedProduct', { foundOrder, date }) 
    } else {
        res.send('No')
    }

    
}
