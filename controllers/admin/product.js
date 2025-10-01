const Product = require("../../models/product");

class adminController {
  async addProduct(req, res) {
    const product = await Product.create({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
    });
    res.status(201).json({
      message: "Product is added",
      productId: product.id,
    });
  }
  async getAllProducts(req, res) {
    const products = await Product.findAll();
    console.log(products);
    res.status(201).json({
      products: products,
    });
  }
  async getProductById(req, res) {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (product) {
      res.status(201).json({
        product: product,
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  }
  async editProduct(req, res) {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (product) {
      product.title = req.body.title;
      product.price = req.body.price;
      product.imageUrl = req.body.imageUrl;
      product.description = req.body.description;
      await product.save();
      res.status(201).json({
        message: "Product is updated",
        product: product,
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  }
  async deleteProduct(req, res) {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (product) {
      await product.destroy();
      res.status(201).json({
        message: "Product is deleted",
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  }
}

module.exports = new adminController();
