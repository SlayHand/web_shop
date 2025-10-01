const Product = require("../models/product");
const Cart = require("../models/cart");

class shopController {
  async getAllProducts(req, res) {
    const products = await Product.findAll();
    console.log(products);
    res.status(201).json({
      products: products,
    });
  }
  async getCart(req, res) {
    const userCart = await req.user.getCart();
    console.log(userCart);
    const cartProducts = await userCart.getProducts();
    res.status(201).json({
      products: cartProducts,
    });
  }
  async addToCart(req, res) {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
      .getCart()
      .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: prodId } });
      })
      .then((products) => {
        let product;
        if (products.length > 0) {
          product = products[0];
        }
        if (product) {
          const oldQuantity = product.cartItem.quantity;
          newQuantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(prodId);
      })
      .then((product) => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      })
      .then(() => {
        res.status(201).json({ message: "Product added to cart" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Adding to cart failed" });
      });
  }
  async removeFromCart(req, res) {
    try {
      const prodId = Number(req.body.productId);
      if (!prodId)
        return res.status(400).json({ message: "Invalid productId" });

      const cart = await req.user.getCart();
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const products = await cart.getProducts({ where: { id: prodId } });
      const product = products[0];
      if (!product) {
        return res.status(404).json({ message: "Product not in cart" });
      }

      const qty = product.cartItem.quantity ?? 0;

      if (qty > 1) {
        await product.cartItem.update({ quantity: qty - 1 });
        return res.status(200).json({
          message: "Quantity decreased",
          productId: prodId,
          quantity: qty - 1,
        });
      } else {
        await product.cartItem.destroy();
        return res.status(200).json({
          message: "Item removed from cart",
          productId: prodId,
          quantity: 0,
          removed: true,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Removing from cart failed" });
    }
  }
}
module.exports = new shopController();
